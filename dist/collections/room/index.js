"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbSchema = _interopRequireDefault(require("./db-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It Contain function layer for room collection.
 * @author: Ankit Kumar Gautam
 */
var ObjectId = require("mongodb").ObjectID;

class RoomClass {
  static add(payload) {
    return this(payload).save();
  }

  static findOneByCondition(condition) {
    return this.findOne(condition);
  }

  static findByCondition(condition) {
    return this.find(condition);
  }

  static update(payload) {
    const updateData = {
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.id, updateData, {
      new: true
    });
  }

  static findChatMessages(payload) {
    return this.aggregate([{
      $lookup: {
        from: "messages",
        let: {
          room_id: "$_id"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$roomId", "$$room_id"]
            }
          }
        }, {
          $sort: {
            createdAt: -1
          }
        }, {
          $skip: (payload.pageNum - 1) * 20
        }, {
          $limit: 20
        }],
        as: "messageData"
      }
    }, {
      $unwind: "$messageData"
    }, {
      $lookup: {
        from: "users",
        localField: "messageData.senderId",
        foreignField: "_id",
        as: "senderData"
      }
    }, {
      $unwind: "$senderData"
    }, {
      $lookup: {
        from: "users",
        localField: "messageData.receiverId",
        foreignField: "_id",
        as: "receiverData"
      }
    }, {
      $unwind: "$receiverData"
    }, {
      $project: {
        messageData: 1,
        "senderData._id": 1,
        "senderData.firstName": 1,
        "senderData.lastName": 1,
        "senderData.profileImage": 1,
        "receiverData._id": 1,
        "receiverData.firstName": 1,
        "receiverData.lastName": 1,
        "receiverData.profileImage": 1
      }
    }, {
      $match: {
        $and: [{
          _id: {
            $eq: ObjectId(payload.roomId)
          }
        }]
      }
    }]);
  }

}

_dbSchema.default.loadClass(RoomClass);

var _default = _mongoose.default.model("rooms", _dbSchema.default);

exports.default = _default;