import socketHandler from "./handler";
const socketIO = require("socket.io");
import USERMODEL from "../collections/user";
import mongoose from "mongoose";
import MESSAGEMODEL from "../collections/message";
import GROUPMODEL from "../collections/group";
import PARTICIPANTMODEL from "../collections/participant";
import fs from "fs";
import {
  encryptpassword,
  generateToken,
  generateRandom,
  getTimeStamp,
  randomToken,
} from "../utilities/universal";
import config from "config";
const { frontendUrl, logoUrl } = config.get("app");
const moment = require("moment");

export default (server) => {
  let io = socketIO(server);
  let users = {};
  io.on("connection", (socket) => {
    socket.on("error", (error) => {
      console.error("Socket error:", error);
    });
    console.log("---------connected--------", socket.id);
    socket.emit("socketConnection", "Socket connected successfully");
    io.to(socket.id).emit("create_socket", { socketId: socket.id });
    // Authenticate User
    socket.on("authenticate", async (query) => {
      console.log("herrre in authenticate");
      const socketId = socket.id;
      if (!query.token || query.token == "") {
        return { status: 400, message: "Please send token" };
      }
      let user = await USERMODEL.checkToken(query.token);
      if (user) {
        user = await USERMODEL.findByIdAndUpdate(
          { _id: user._id },
          {
            $set: {
              socketId: socketId,
              isOnline: true,
            },
          },
          { new: true }
        );

        let query = [
          {
            $match: {
              receiverId: mongoose.Types.ObjectId(user._id),
            },
          },
          {
            $lookup: {
              from: "users",
              localField: "receiverId",
              foreignField: "_id",
              as: "receiverData",
            },
          },
          { $unwind: "$receiverData" },
          {
            $lookup: {
              from: "users",
              localField: "senderId",
              foreignField: "_id",
              as: "senderData",
            },
          },
          { $unwind: "$senderData" },
          {
            $lookup: {
              from: "messages",
              localField: "messageId",
              foreignField: "_id",
              as: "messageData",
            },
          },
          { $unwind: "$messageData" },
        ];

        let participants = await PARTICIPANTMODEL.aggregate(query);

        if (participants.length) {
          for (var i = 0; i < participants.length; i++) {
            if (io.sockets.connected[participants[i].receiverData.socketId]) {
              /* RECEIVE MESSAGE  */
              var output = {
                id: participants[i].messageData.id,
                threadId: participants[i].messageData.threadId,
                groupId: participants[i].messageData.groupId,
                senderId: participants[i].messageData.senderId,
                receiverId: participants[i].messageData.receiverId,
                message: participants[i].messageData.message,
                messageId:participants[i].messageId,
                createdAt: participants[i].messageData.createdAt,
                senderData: {
                  id: participants[i].senderData._id,
                  fullName: participants[i].senderData.fullName,
                  image: participants[i].senderData.image,
                },
                receiver_data: {
                  id: participants[i].receiverData._id,
                  fullName: participants[i].receiverData.fullName,
                  image: participants[i].receiverData.image,
                },
              };
              io.to(participants[i].receiverData.socketId).emit(
                "receiveMessage",
                {
                  message: participants[i].messageData.message,
                  payload: output,
                }
              );
            }
          }
        }
        let userId = user._id;
        socket[socketId] = { userId };
        users[userId] = { socketId };
        return {
          statusCode: 200,
          status: "success",
          message: "Connection successfully.",
          data: "",
        };
      }
    });

    // Disconnect Socket
    socket.on("disconnect", (data) => {
      if (!data.token || data.token == "") {
        return { status: 400, message: "Please send token" };
      }

      // ChatService.disconnect({ data }, (res) => {
      //   console.log("disconnect");
      // });
    });

    socket.on("sendMessage", async (query, callback) => {
      const socketId = socket.id;
      if (!query.token || query.token == "") {
        return { status: 400, message: "Please send token" };
      }

      let threadId;
      let user = await USERMODEL.checkToken(query.token);
      if (user) {
        if (query.type == "one2one") {
          let isThreadExist = await MESSAGEMODEL.findOne({
            $or: [
              {
                senderId: mongoose.Types.ObjectId(user._id),
                receiverId: mongoose.Types.ObjectId(query.receiverId),
              },
              {
                senderId: mongoose.Types.ObjectId(query.receiverId),
                receiverId: mongoose.Types.ObjectId(user._id),
              },
            ],
          });

          if (isThreadExist) {
            threadId = isThreadExist.threadId;
          } else {
            var possible =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 8; i++) {
              threadId += possible.charAt(
                Math.floor(Math.random() * possible.length)
              );
            }
          }

          let messageObj = {
            threadId: threadId,
            type: query.type,
            senderId: user._id,
            receiverId: query.receiverId,
            groupId:
              query.groupId && query.groupId != undefined && query.groupId != ""
                ? query.groupId
                : null,
            message: query.message,
          };
          let saveMessage = await MESSAGEMODEL.saveMessage(messageObj);

          let participantObj = {
            threadId: threadId,
            type: query.type,
            groupId: null,
            senderId: user._id,
            messageId: saveMessage._id,
            receiverId: query.receiverId,
            lastMessageId: saveMessage._id,
            lastMessage: saveMessage.message,
          };

          let saveParticipant = await PARTICIPANTMODEL.saveParticipant(
            participantObj
          );

          await PARTICIPANTMODEL.updateMany(
            { threadId: threadId },
            {
              lastMessageId: saveMessage._id,
              lastMessage: saveMessage.message,
            }
          );

          let queryData = [
            {
              $match: {
                _id: mongoose.Types.ObjectId(saveParticipant._id),
              },
            },
            {
              $lookup: {
                from: "users",
                localField: "receiverId",
                foreignField: "_id",
                as: "receiverData",
              },
            },
            { $unwind: "$receiverData" },
            {
              $lookup: {
                from: "users",
                localField: "senderId",
                foreignField: "_id",
                as: "senderData",
              },
            },
            { $unwind: "$senderData" },
            {
              $lookup: {
                from: "messages",
                localField: "messageId",
                foreignField: "_id",
                as: "messageData",
              },
            },
            { $unwind: "$messageData" },
          ];

          let participantData = await PARTICIPANTMODEL.aggregate(queryData);
          for (var i = 0; i < participantData.length; i++) {
            if (
              io.sockets.connected[participantData[i].receiverData.socketId]
            ) {
              /* RECEIVE MESSAGE  */
              var output = {
                id: participantData[i].messageData.id,
                threadId: participantData[i].messageData.threadId,
                groupId: participantData[i].messageData.groupId,
                senderId: participantData[i].messageData.senderId,
                receiverId: participantData[i].messageData.receiverId,
                message: participantData[i].messageData.message,
                messageId:participantData[i].messageId,
                createdAt: participantData[i].messageData.createdAt,
                senderData: {
                  id: participantData[i].senderData._id,
                  fullName: participantData[i].senderData.fullName,
                  image: participantData[i].senderData.image,
                },
                receiver_data: {
                  id: participantData[i].receiverData._id,
                  fullName: participantData[i].receiverData.fullName,
                  image: participantData[i].receiverData.image,
                },
              };
              io.to(participantData[i].receiverData.socketId).emit(
                "receiveMessage",
                {
                  message: participantData[i].messageData.message,
                  payload: output,
                }
              );
              callback(null, {
                statusCode: 200,
                status: "success",
                message: "Message send successfully.",
                data: output,
              });
            }
          }
        }

        if (query.type == "group") {
          let isThreadExist = await MESSAGEMODEL.findOne({
            groupId: query.groupId,
          });

          if (isThreadExist) {
            threadId = isThreadExist.threadId;
          } else {
            var possible =
              "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 8; i++) {
              threadId += possible.charAt(
                Math.floor(Math.random() * possible.length)
              );
            }
          }
          let messageObj = {
            threadId: threadId,
            type: query.type,
            senderId: user._id,
            receiverId: null,
            groupId:
              query.groupId && query.groupId != undefined && query.groupId != ""
                ? query.groupId
                : null,
            message: query.message,
          };
          let saveMessage = await MESSAGEMODEL.saveMessage(messageObj);

          let groupData = await GROUPMODEL.findOne({
            _id: mongoose.Types.ObjectId(query.groupId),
          });
          for (let i = 0; i < groupData.users.length; i++) {
            console.log(i, "i");
            if (!user._id.equals(groupData.users[i].userId)) {
              let participantObj = {
                threadId: threadId,
                type:query.type,
                groupId: query.groupId,
                senderId: user._id,
                messageId: saveMessage._id,
                receiverId: groupData.users[i].userId,
                lastMessageId: saveMessage._id,
                lastMessage: saveMessage.message,
              };

              let saveParticipant = await PARTICIPANTMODEL.saveParticipant(
                participantObj
              );

              await PARTICIPANTMODEL.updateMany(
                { threadId: threadId },
                {
                  lastMessageId: saveMessage._id,
                  lastMessage: saveMessage.message,
                }
              );
              let queryData = [
                {
                  $match: {
                    _id: mongoose.Types.ObjectId(saveParticipant._id),
                  },
                },
                {
                  $lookup: {
                    from: "users",
                    localField: "receiverId",
                    foreignField: "_id",
                    as: "receiverData",
                  },
                },
                { $unwind: "$receiverData" },
                {
                  $lookup: {
                    from: "users",
                    localField: "senderId",
                    foreignField: "_id",
                    as: "senderData",
                  },
                },
                { $unwind: "$senderData" },
                {
                  $lookup: {
                    from: "messages",
                    localField: "messageId",
                    foreignField: "_id",
                    as: "messageData",
                  },
                },
                { $unwind: "$messageData" },
              ];

              let participantData = await PARTICIPANTMODEL.aggregate(queryData);
              if (
                io.sockets.connected[participantData[0].receiverData.socketId]
              ) {
                /* RECEIVE MESSAGE  */
                var output = {
                  id: participantData[0].messageData.id,
                  threadId: participantData[0].messageData.threadId,
                  groupId: participantData[0].messageData.groupId,
                  senderId: participantData[0].messageData.senderId,
                  receiverId: participantData[0].messageData.receiverId,
                  message: participantData[0].messageData.message,
                  messageId:participantData[0].messageId,
                  createdAt: participantData[0].messageData.createdAt,
                  messageId:participantData[0].messageData._id,
                  senderData: {
                    id: participantData[0].senderData._id,
                    fullName: participantData[0].senderData.fullName,
                    image: participantData[0].senderData.image,
                  },
                  receiver_data: {
                    id: participantData[0].receiverData._id,
                    fullName: participantData[0].receiverData.fullName,
                    image: participantData[0].receiverData.image,
                  },
                };
                io.to(participantData[0].receiverData.socketId).emit(
                  "receiveMessage",
                  {
                    message: participantData[0].messageData.message,
                    payload: output,
                  }
                );
              }
            }
          }
          callback(null, {
            statusCode: 200,
            status: "success",
            message: "Message send successfully.",
            data: "",
          });
        }
      }
    });

    socket.on("readMessage", async (data, callback) => {
      if (!data.token || data.token == "") {
        return { status: 400, message: "Please send token" };
      }

      if (!data.id || data.id == "") {
        return {
          status: 400,
          message:
            "Please send message id if type is Single / user id if type is All",
        };
      }

      if (!data.type || data.type == "") {
        return { status: 400, message: "Please send type single/all/group" };
      }

      let user = await USERMODEL.checkToken(data.token);
      if (user) {
        if (data.type == "single")
          await PARTICIPANTMODEL.findOneAndUpdate(
            {
              messageId: mongoose.Types.ObjectId(data.id),
              //receiverId: mongoose.Types.ObjectId(user._id),
            },
            {
              $set: {
                isDelivered: true,
                isRead: true,
              },
            }
          );

        if (data.type == "all")
          await PARTICIPANTMODEL.updateMany(
            {
              senderId: mongoose.Types.ObjectId(data.id),
              receiverId: mongoose.Types.ObjectId(user._id),
            },
            {
              $set: {
                isDelivered: true,
                isRead: true,
              },
            }
          );

        if (data.type == "group")
          await PARTICIPANTMODEL.updateMany(
            {
              groupId: mongoose.Types.ObjectId(data.id),
              receiverId: mongoose.Types.ObjectId(user._id),
            },
            {
              $set: {
                isDelivered: true,
                isRead: true,
              },
            }
          );

        callback(null, {
          statusCode: 200,
          status: "success",
          message: "Message read successfully.",
          data: "",
        });
      }
    });

    socket.on("markMessageAsDelivered", async (data, callback) => {
      if (!data.token || data.token == "") {
        return { status: 400, message: "Please send token" };
      }

      if (!data.id || data.id == "") {
        return {
          status: 400,
          message:
            "Please send message id if type is Single / user id if type is All",
        };
      }

      let user = await USERMODEL.checkToken(data.token);
      if (user) {
        await PARTICIPANTMODEL.findOneAndUpdate(
          {
            messageId: mongoose.Types.ObjectId(data.id),
            receiverId: mongoose.Types.ObjectId(user._id),
          },
          {
            $set: {
              isDelivered: true,
            },
          }
        );

        callback(null, {
          statusCode: 200,
          status: "success",
          message: "Message delivered successfully.",
          data: "",
        });
      }
    });
  });
};
