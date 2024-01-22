/* -----------------------------------------------------------------------
   * @ description : Main module containing all the Event management functonality
----------------------------------------------------------------------- */

import USERMODEL from "../collections/user";
import mongoose from "mongoose";
import MESSAGEMODEL from "../collections/message";
import GROUPMODEL from "../collections/group";
import PARTICIPANTMODEL from "../collections/participant";
import config from "config";
const { frontendUrl, logoUrl } = config.get("app");
const moment = require("moment");
//import { uploadFile } from "../controllers/common";

export default {
  /************ Authenticate user on make socket connection ********/
    authenticate: async (query, callback) => {
    let user = await USERMODEL.checkToken(query.token);
      if (user) {
        user = await USERMODEL.findByIdAndUpdate(
          { _id: user._id },
          {
            $set: {
              socketId: query.socketId,
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
        // let userId = user._id;
        // socket[socketId] = { userId };
        // users[userId] = { socketId };
        callback(null, {
          statusCode: 200,
          status: "success",
          message: "Connection successfully.",
          data: user,
        });
      }
  },
  
  /************ Logout socket session on discoonect socket **********/
  disconnect: async (request, callback) => {
    const { userId } = request;    
    callback(userId);
  }
};
