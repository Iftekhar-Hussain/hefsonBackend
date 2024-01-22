"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _handler = _interopRequireDefault(require("./handler"));

var _user = _interopRequireDefault(require("../collections/user"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _message = _interopRequireDefault(require("../collections/message"));

var _group = _interopRequireDefault(require("../collections/group"));

var _participant = _interopRequireDefault(require("../collections/participant"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

const socketIO = require("socket.io");

const {
  frontendUrl,
  logoUrl
} = _config.default.get("app");

const moment = require("moment");

var _default = server => {
  let io = socketIO(server);
  let users = {};
  io.on("connection", socket => {
    socket.on("error", error => {
      console.error("Socket error:", error);
    });
    console.log("---------connected--------", socket.id);
    socket.emit("socketConnection", "Socket connected successfully");
    io.to(socket.id).emit("create_socket", {
      socketId: socket.id
    }); // Authenticate User

    socket.on("authenticate", async query => {
      console.log("herrre in authenticate");
      const socketId = socket.id;

      if (!query.token || query.token == "") {
        return {
          status: 400,
          message: "Please send token"
        };
      }

      let user = await _user.default.checkToken(query.token);

      if (user) {
        user = await _user.default.findByIdAndUpdate({
          _id: user._id
        }, {
          $set: {
            socketId: socketId,
            isOnline: true
          }
        }, {
          new: true
        });
        let query = [{
          $match: {
            receiverId: _mongoose.default.Types.ObjectId(user._id)
          }
        }, {
          $lookup: {
            from: "users",
            localField: "receiverId",
            foreignField: "_id",
            as: "receiverData"
          }
        }, {
          $unwind: "$receiverData"
        }, {
          $lookup: {
            from: "users",
            localField: "senderId",
            foreignField: "_id",
            as: "senderData"
          }
        }, {
          $unwind: "$senderData"
        }, {
          $lookup: {
            from: "messages",
            localField: "messageId",
            foreignField: "_id",
            as: "messageData"
          }
        }, {
          $unwind: "$messageData"
        }];
        let participants = await _participant.default.aggregate(query);

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
                messageId: participants[i].messageId,
                createdAt: participants[i].messageData.createdAt,
                senderData: {
                  id: participants[i].senderData._id,
                  fullName: participants[i].senderData.fullName,
                  image: participants[i].senderData.image
                },
                receiver_data: {
                  id: participants[i].receiverData._id,
                  fullName: participants[i].receiverData.fullName,
                  image: participants[i].receiverData.image
                }
              };
              io.to(participants[i].receiverData.socketId).emit("receiveMessage", {
                message: participants[i].messageData.message,
                payload: output
              });
            }
          }
        }

        let userId = user._id;
        socket[socketId] = {
          userId
        };
        users[userId] = {
          socketId
        };
        return {
          statusCode: 200,
          status: "success",
          message: "Connection successfully.",
          data: ""
        };
      }
    }); // Disconnect Socket

    socket.on("disconnect", data => {
      if (!data.token || data.token == "") {
        return {
          status: 400,
          message: "Please send token"
        };
      } // ChatService.disconnect({ data }, (res) => {
      //   console.log("disconnect");
      // });

    });
    socket.on("sendMessage", async (query, callback) => {
      const socketId = socket.id;

      if (!query.token || query.token == "") {
        return {
          status: 400,
          message: "Please send token"
        };
      }

      let threadId;
      let user = await _user.default.checkToken(query.token);

      if (user) {
        if (query.type == "one2one") {
          let isThreadExist = await _message.default.findOne({
            $or: [{
              senderId: _mongoose.default.Types.ObjectId(user._id),
              receiverId: _mongoose.default.Types.ObjectId(query.receiverId)
            }, {
              senderId: _mongoose.default.Types.ObjectId(query.receiverId),
              receiverId: _mongoose.default.Types.ObjectId(user._id)
            }]
          });

          if (isThreadExist) {
            threadId = isThreadExist.threadId;
          } else {
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 8; i++) {
              threadId += possible.charAt(Math.floor(Math.random() * possible.length));
            }
          }

          let messageObj = {
            threadId: threadId,
            type: query.type,
            senderId: user._id,
            receiverId: query.receiverId,
            groupId: query.groupId && query.groupId != undefined && query.groupId != "" ? query.groupId : null,
            message: query.message
          };
          let saveMessage = await _message.default.saveMessage(messageObj);
          let participantObj = {
            threadId: threadId,
            type: query.type,
            groupId: null,
            senderId: user._id,
            messageId: saveMessage._id,
            receiverId: query.receiverId,
            lastMessageId: saveMessage._id,
            lastMessage: saveMessage.message
          };
          let saveParticipant = await _participant.default.saveParticipant(participantObj);
          await _participant.default.updateMany({
            threadId: threadId
          }, {
            lastMessageId: saveMessage._id,
            lastMessage: saveMessage.message
          });
          let queryData = [{
            $match: {
              _id: _mongoose.default.Types.ObjectId(saveParticipant._id)
            }
          }, {
            $lookup: {
              from: "users",
              localField: "receiverId",
              foreignField: "_id",
              as: "receiverData"
            }
          }, {
            $unwind: "$receiverData"
          }, {
            $lookup: {
              from: "users",
              localField: "senderId",
              foreignField: "_id",
              as: "senderData"
            }
          }, {
            $unwind: "$senderData"
          }, {
            $lookup: {
              from: "messages",
              localField: "messageId",
              foreignField: "_id",
              as: "messageData"
            }
          }, {
            $unwind: "$messageData"
          }];
          let participantData = await _participant.default.aggregate(queryData);

          for (var i = 0; i < participantData.length; i++) {
            if (io.sockets.connected[participantData[i].receiverData.socketId]) {
              /* RECEIVE MESSAGE  */
              var output = {
                id: participantData[i].messageData.id,
                threadId: participantData[i].messageData.threadId,
                groupId: participantData[i].messageData.groupId,
                senderId: participantData[i].messageData.senderId,
                receiverId: participantData[i].messageData.receiverId,
                message: participantData[i].messageData.message,
                messageId: participantData[i].messageId,
                createdAt: participantData[i].messageData.createdAt,
                senderData: {
                  id: participantData[i].senderData._id,
                  fullName: participantData[i].senderData.fullName,
                  image: participantData[i].senderData.image
                },
                receiver_data: {
                  id: participantData[i].receiverData._id,
                  fullName: participantData[i].receiverData.fullName,
                  image: participantData[i].receiverData.image
                }
              };
              io.to(participantData[i].receiverData.socketId).emit("receiveMessage", {
                message: participantData[i].messageData.message,
                payload: output
              });
              callback(null, {
                statusCode: 200,
                status: "success",
                message: "Message send successfully.",
                data: output
              });
            }
          }
        }

        if (query.type == "group") {
          let isThreadExist = await _message.default.findOne({
            groupId: query.groupId
          });

          if (isThreadExist) {
            threadId = isThreadExist.threadId;
          } else {
            var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

            for (var i = 0; i < 8; i++) {
              threadId += possible.charAt(Math.floor(Math.random() * possible.length));
            }
          }

          let messageObj = {
            threadId: threadId,
            type: query.type,
            senderId: user._id,
            receiverId: null,
            groupId: query.groupId && query.groupId != undefined && query.groupId != "" ? query.groupId : null,
            message: query.message
          };
          let saveMessage = await _message.default.saveMessage(messageObj);
          let groupData = await _group.default.findOne({
            _id: _mongoose.default.Types.ObjectId(query.groupId)
          });

          for (let i = 0; i < groupData.users.length; i++) {
            console.log(i, "i");

            if (!user._id.equals(groupData.users[i].userId)) {
              let participantObj = {
                threadId: threadId,
                type: query.type,
                groupId: query.groupId,
                senderId: user._id,
                messageId: saveMessage._id,
                receiverId: groupData.users[i].userId,
                lastMessageId: saveMessage._id,
                lastMessage: saveMessage.message
              };
              let saveParticipant = await _participant.default.saveParticipant(participantObj);
              await _participant.default.updateMany({
                threadId: threadId
              }, {
                lastMessageId: saveMessage._id,
                lastMessage: saveMessage.message
              });
              let queryData = [{
                $match: {
                  _id: _mongoose.default.Types.ObjectId(saveParticipant._id)
                }
              }, {
                $lookup: {
                  from: "users",
                  localField: "receiverId",
                  foreignField: "_id",
                  as: "receiverData"
                }
              }, {
                $unwind: "$receiverData"
              }, {
                $lookup: {
                  from: "users",
                  localField: "senderId",
                  foreignField: "_id",
                  as: "senderData"
                }
              }, {
                $unwind: "$senderData"
              }, {
                $lookup: {
                  from: "messages",
                  localField: "messageId",
                  foreignField: "_id",
                  as: "messageData"
                }
              }, {
                $unwind: "$messageData"
              }];
              let participantData = await _participant.default.aggregate(queryData);

              if (io.sockets.connected[participantData[0].receiverData.socketId]) {
                /* RECEIVE MESSAGE  */
                var output = {
                  id: participantData[0].messageData.id,
                  threadId: participantData[0].messageData.threadId,
                  groupId: participantData[0].messageData.groupId,
                  senderId: participantData[0].messageData.senderId,
                  receiverId: participantData[0].messageData.receiverId,
                  message: participantData[0].messageData.message,
                  messageId: participantData[0].messageId,
                  createdAt: participantData[0].messageData.createdAt,
                  messageId: participantData[0].messageData._id,
                  senderData: {
                    id: participantData[0].senderData._id,
                    fullName: participantData[0].senderData.fullName,
                    image: participantData[0].senderData.image
                  },
                  receiver_data: {
                    id: participantData[0].receiverData._id,
                    fullName: participantData[0].receiverData.fullName,
                    image: participantData[0].receiverData.image
                  }
                };
                io.to(participantData[0].receiverData.socketId).emit("receiveMessage", {
                  message: participantData[0].messageData.message,
                  payload: output
                });
              }
            }
          }

          callback(null, {
            statusCode: 200,
            status: "success",
            message: "Message send successfully.",
            data: ""
          });
        }
      }
    });
    socket.on("readMessage", async (data, callback) => {
      if (!data.token || data.token == "") {
        return {
          status: 400,
          message: "Please send token"
        };
      }

      if (!data.id || data.id == "") {
        return {
          status: 400,
          message: "Please send message id if type is Single / user id if type is All"
        };
      }

      if (!data.type || data.type == "") {
        return {
          status: 400,
          message: "Please send type single/all/group"
        };
      }

      let user = await _user.default.checkToken(data.token);

      if (user) {
        if (data.type == "single") await _participant.default.findOneAndUpdate({
          messageId: _mongoose.default.Types.ObjectId(data.id) //receiverId: mongoose.Types.ObjectId(user._id),

        }, {
          $set: {
            isDelivered: true,
            isRead: true
          }
        });
        if (data.type == "all") await _participant.default.updateMany({
          senderId: _mongoose.default.Types.ObjectId(data.id),
          receiverId: _mongoose.default.Types.ObjectId(user._id)
        }, {
          $set: {
            isDelivered: true,
            isRead: true
          }
        });
        if (data.type == "group") await _participant.default.updateMany({
          groupId: _mongoose.default.Types.ObjectId(data.id),
          receiverId: _mongoose.default.Types.ObjectId(user._id)
        }, {
          $set: {
            isDelivered: true,
            isRead: true
          }
        });
        callback(null, {
          statusCode: 200,
          status: "success",
          message: "Message read successfully.",
          data: ""
        });
      }
    });
    socket.on("markMessageAsDelivered", async (data, callback) => {
      if (!data.token || data.token == "") {
        return {
          status: 400,
          message: "Please send token"
        };
      }

      if (!data.id || data.id == "") {
        return {
          status: 400,
          message: "Please send message id if type is Single / user id if type is All"
        };
      }

      let user = await _user.default.checkToken(data.token);

      if (user) {
        await _participant.default.findOneAndUpdate({
          messageId: _mongoose.default.Types.ObjectId(data.id),
          receiverId: _mongoose.default.Types.ObjectId(user._id)
        }, {
          $set: {
            isDelivered: true
          }
        });
        callback(null, {
          statusCode: 200,
          status: "success",
          message: "Message delivered successfully.",
          data: ""
        });
      }
    });
  });
};

exports.default = _default;