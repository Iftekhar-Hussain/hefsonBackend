"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.getAll = exports.clearNotification = exports.markAsRead = exports.list = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _notification = _interopRequireDefault(require("../collections/notification"));

var _participant = _interopRequireDefault(require("../collections/participant"));

var _user = _interopRequireDefault(require("../collections/user"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

var _axios = _interopRequireDefault(require("axios"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: device.js
 * @description: It Contain function layer for device service.
 * @author: Aditi Goel
 */
const imagePath = "./public/imagels/";
const videoPath = "./public/uploads/";

const {
  frontendUrl,
  logoUrl
} = _config.default.get("app");

const moment = require("moment");

var xl = require("excel4node");

/**
 *
 * @param {*} payload
 * @description - get all device list to db
 */

/********** get all list**********/
const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj;

  if (user.role != 1) {
    matchObj = {
      isDeleted: false,
      isArchived: false,
      receiverId: _mongoose.default.Types.ObjectId(user.userId)
    };
  } else {
    matchObj = {
      isDeleted: false,
      type: "alarm"
    };
  }

  let query = [{
    $match: matchObj
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
      localField: "driverId",
      foreignField: "_id",
      as: "driverData"
    }
  }, {
    $unwind: {
      path: "$driverData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "trucks",
      localField: "truckId",
      foreignField: "_id",
      as: "truckData"
    }
  }, {
    $unwind: {
      path: "$truckData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "trailers",
      localField: "trailerId",
      foreignField: "_id",
      as: "trailerData"
    }
  }, {
    $unwind: {
      path: "$trailerData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "shipments",
      localField: "shipmentId",
      foreignField: "_id",
      as: "shipmentData"
    }
  }, {
    $unwind: {
      path: "$shipmentData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _notification.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let notificationList = await _notification.default.aggregate(query);
  let chatcount = await _notification.default.find({
    receiverId: _mongoose.default.Types.ObjectId(user.userId),
    isRead: false
  });
  return {
    data: notificationList,
    total: total,
    unReadCount: chatcount.length
  };
};

exports.list = list;

const markAsRead = async (user, payload) => {
  return await _notification.default.findOneAndUpdate({
    _id: payload.id
  }, {
    $set: {
      isRead: true
    }
  }, {
    new: true
  });
};

exports.markAsRead = markAsRead;

const clearNotification = async (user, payload) => {
  await _notification.default.updateMany({
    receiverId: _mongoose.default.Types.ObjectId(user.userId)
  }, {
    $set: {
      isRead: true,
      isArchived: true
    }
  }, {
    new: true
  });
  return true;
};

exports.clearNotification = clearNotification;

const getAll = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj;

  if (user.role != 1) {
    matchObj = {
      isDeleted: false,
      receiverId: _mongoose.default.Types.ObjectId(user.userId),
      type: {
        $ne: 'alarm'
      }
    };
  } else {
    matchObj = {
      isDeleted: false,
      type: "alarm"
    };
  }

  let query = [{
    $match: matchObj
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
      localField: "driverId",
      foreignField: "_id",
      as: "driverData"
    }
  }, {
    $unwind: {
      path: "$driverData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "trucks",
      localField: "truckId",
      foreignField: "_id",
      as: "truckData"
    }
  }, {
    $unwind: {
      path: "$truckData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "trailers",
      localField: "trailerId",
      foreignField: "_id",
      as: "trailerData"
    }
  }, {
    $unwind: {
      path: "$trailerData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "shipments",
      localField: "shipmentId",
      foreignField: "_id",
      as: "shipmentData"
    }
  }, {
    $unwind: {
      path: "$shipmentData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _notification.default.aggregate(query).allowDiskUse(true);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let notificationList = await _notification.default.aggregate(query).allowDiskUse(true);
  let chatcount = await _notification.default.find({
    receiverId: _mongoose.default.Types.ObjectId(user.userId),
    isRead: false
  });
  return {
    data: notificationList,
    total: total,
    unReadCount: chatcount.length
  };
};

exports.getAll = getAll;