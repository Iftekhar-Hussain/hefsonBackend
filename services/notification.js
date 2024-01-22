/*
 * @file: device.js
 * @description: It Contain function layer for device service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import NOTIFICATIONMODEL from "../collections/notification";
import PARTICIPANTMODEL from "../collections/participant";
import USERMODEL from "../collections/user";
import Message from "../utilities/messages";
import fs from "fs";
import {
  encryptpassword,
  generateToken,
  generateRandom,
  getTimeStamp,
  getDistance,
  randomToken,
} from "../utilities/universal";
import path from "path";
const imagePath = "./public/imagels/";
const videoPath = "./public/uploads/";
import config from "config";
const { frontendUrl, logoUrl } = config.get("app");
const moment = require("moment");
import axios from "axios";
var xl = require("excel4node");
import { uploadFile } from "../utilities/universal";

/**
 *
 * @param {*} payload
 * @description - get all device list to db
 */
/********** get all list**********/
export const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj;
  if (user.role != 1) {
    matchObj = {
      isDeleted: false,
      isArchived:false,
      receiverId: mongoose.Types.ObjectId(user.userId),
    };
  } else {
    matchObj = {
      isDeleted: false,
      type: "alarm",
    };
  }
  let query = [
    {
      $match: matchObj,
    },
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
        localField: "driverId",
        foreignField: "_id",
        as: "driverData",
      },
    },
    { $unwind: { path: "$driverData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truckData",
      },
    },
    { $unwind: { path: "$truckData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "trailers",
        localField: "trailerId",
        foreignField: "_id",
        as: "trailerData",
      },
    },
    { $unwind: { path: "$trailerData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "shipments",
        localField: "shipmentId",
        foreignField: "_id",
        as: "shipmentData",
      },
    },
    { $unwind: { path: "$shipmentData", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await NOTIFICATIONMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let notificationList = await NOTIFICATIONMODEL.aggregate(query);

  let chatcount = await NOTIFICATIONMODEL.find({
    receiverId: mongoose.Types.ObjectId(user.userId),
    isRead: false,
  });
  return {
    data: notificationList,
    total: total,
    unReadCount: chatcount.length,
  };
};

export const markAsRead = async (user, payload) => {
  return await NOTIFICATIONMODEL.findOneAndUpdate(
    { _id: payload.id },
    {
      $set: {
        isRead: true,
      },
    },
    { new: true }
  );
};

export const clearNotification = async (user, payload) => {
   await NOTIFICATIONMODEL.updateMany(
    { receiverId: mongoose.Types.ObjectId(user.userId) },
    {
      $set: {
        isRead: true,
        isArchived: true,
      },
    },
    { new: true }
  );
  return true;
};


export const getAll = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj;
  if (user.role != 1) {
    matchObj = {
      isDeleted: false,
      receiverId: mongoose.Types.ObjectId(user.userId),
      type:{$ne:'alarm'}
    };
  } else {
    matchObj = {
      isDeleted: false,
      type: "alarm",
    };
  }
  let query = [
    {
      $match: matchObj,
    },
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
        localField: "driverId",
        foreignField: "_id",
        as: "driverData",
      },
    },
    { $unwind: { path: "$driverData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "trucks",
        localField: "truckId",
        foreignField: "_id",
        as: "truckData",
      },
    },
    { $unwind: { path: "$truckData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "trailers",
        localField: "trailerId",
        foreignField: "_id",
        as: "trailerData",
      },
    },
    { $unwind: { path: "$trailerData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "shipments",
        localField: "shipmentId",
        foreignField: "_id",
        as: "shipmentData",
      },
    },
    { $unwind: { path: "$shipmentData", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await NOTIFICATIONMODEL.aggregate(query).allowDiskUse(true);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let notificationList = await NOTIFICATIONMODEL.aggregate(query).allowDiskUse(true);

  let chatcount = await NOTIFICATIONMODEL.find({
    receiverId: mongoose.Types.ObjectId(user.userId),
    isRead: false,
  });
  return {
    data: notificationList,
    total: total,
    unReadCount: chatcount.length,
  };
};
