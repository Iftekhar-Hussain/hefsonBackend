/*
 * @file: chat.js
 * @description: It Contain function layer for category service.
 * @author: Aditi Goel
 */

import mongoose, { mongo } from "mongoose";
import MESSAGEMODEL from "../collections/message";
import USERMODEL from "../collections/user";
import GROUPMODEL from "../collections/group";
import PARTICIPANTMODEL from "../collections/participant";
import Message from "../utilities/messages";
import fs from "fs";
import {
  encryptpassword,
  generateToken,
  generateRandom,
  getTimeStamp,
  randomToken,
} from "../utilities/universal";
import path from "path";
const imagePath = "./public/images/";
const videoPath = "./public/uploads/";
import config from "config";
const { frontendUrl, logoUrl } = config.get("app");
const moment = require("moment");

export const createGroup = async (user, payload) => {
  let Obj = {
    name: payload.name,
    createdBy: user.userId,
    users: payload.users,
  };
  let saveData = await GROUPMODEL.create(Obj);
  let threadId;
  var possible =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

  for (var i = 0; i < 8; i++) {
    threadId += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  let messageData = await MESSAGEMODEL.create({
    message: "Group Created - " + payload.name,
    threadId: threadId,
    groupId: saveData._id,
    type: "group",
    senderId: user.userId,
  });
  for (let i = 0; i < payload.users.length; i++) {
    if (user.userId !== payload.users[i].userId) {
      let participantObj = {
        message: "Group Created - " + payload.name,
        threadId: threadId,
        groupId: saveData._id,
        lastMessage: messageData.message,
        lastMessageId: messageData._id,
        messageId: messageData._id,
        type: "group",
        senderId: user.userId,
        receiverId: payload.users[i].userId,
      };
      let participantData = await PARTICIPANTMODEL.create(participantObj);
    }
  }

  return saveData;
};

export const getInbox = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    $or: [
      {
        senderId: mongoose.Types.ObjectId(user.userId),
      },
      {
        receiverId: mongoose.Types.ObjectId(user.userId),
      },
    ],
    isDeleted: false,
  };
  // if (payload.search) {
  //   payload.search = payload.search.toLowerCase();
  //   const regex = new RegExp(`${payload["search"]}`, "i");
  //   // $or: [{ unitNumber: { $regex: regex } }],
  //   matchObj = {
  //     ...matchObj,
  //     $or: [
  //       { "inboxData.senderData.firstName": { $regex: regex } },
  //       { "inboxData.senderData.lastName": { $regex: regex } },
  //       { "inboxData.senderData.fullName": { $regex: regex } },
  //     ],
  //   };
  // }

  // console.log('match',matchObj)
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
    {
      $unwind: { path: "$senderData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "users",
        localField: "receiverId",
        foreignField: "_id",
        as: "receiverData",
      },
    },
    {
      $unwind: { path: "$receiverData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "groups",
        localField: "groupId",
        foreignField: "_id",
        as: "groupData",
      },
    },
    {
      $unwind: { path: "$groupData", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$threadId",
        inboxData: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $sort: {
        createdAt: -1,
      },
    },
  ];
  let count = await PARTICIPANTMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let inboxList = await PARTICIPANTMODEL.aggregate(query);

  for (let i = 0; i < inboxList.length; i++) {
    if (
      inboxList[i].inboxData.groupId &&
      inboxList[i].inboxData.groupId != null &&
      inboxList[i].inboxData.groupId != ""
    ) {
      let groupInfo = await GROUPMODEL.aggregate([
        {
          $match: {
            _id: mongoose.Types.ObjectId(inboxList[i].inboxData.groupId),
          },
        },
        {
          $lookup: {
            from: "users",
            localField: "users.userId",
            foreignField: "_id",
            as: "userInfo",
          },
        },
        {
          $project: {
            _id: 1,
            name: 1,
            createdBy: 1,
            users: 1,
            userInfo: {
              _id: 1,
              email: 1,
              image: 1,
              fullName: 1,
              firstName: 1,
              lastName: 1,
            },
          },
        },
      ]);
      inboxList[i].groupInfo = groupInfo[0];
    }
  }

  for (let j = 0; j < inboxList.length; j++) {
    let countMsg = await PARTICIPANTMODEL.count({
      threadId: inboxList[j].inboxData.threadId,
      isRead: false,
    });
    inboxList[j].unReadMsgCount = countMsg;
  }
  return {
    data: inboxList,
    total: total,
  };
};

export const messageListing = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);

  let query = [
    {
      $match: {
        threadId: payload.threadId,
        $or: [
          {
            $and: [
              {
                senderId: mongoose.Types.ObjectId(user.userId),
              },
              { isSender: false },
            ],
          },
          {
            $and: [
              {
                receiverId: mongoose.Types.ObjectId(user.userId),
              },
              { isReceiver: false },
            ],
          },
        ],
      },
    },
    {
      $lookup: {
        from: "users",
        let: { id: "$senderId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
          {
            $project: {
              _id: 1,
              email: 1,
              id: 1,
              firstName: 1,
              lastName: 1,
              image: 1,
              role: 1,
              fullName: 1,
            },
          },
        ],
        as: "senderData",
      },
    },
    {
      $unwind: { path: "$senderData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "users",
        let: { id: "$receiverId" },
        pipeline: [
          { $match: { $expr: { $eq: ["$_id", "$$id"] } } },
          {
            $project: {
              _id: 1,
              email: 1,
              id: 1,
              firstName: 1,
              lastName: 1,
              image: 1,
              role: 1,
              fullName: 1,
            },
          },
        ],
        as: "receiverData",
      },
    },
    {
      $unwind: { path: "$receiverData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "messages",
        localField: "messageId",
        foreignField: "_id",
        as: "messageData",
      },
    },
    {
      $unwind: { path: "$messageData", preserveNullAndEmptyArrays: true },
    },
    {
      $lookup: {
        from: "groups",
        localField: "groupId",
        foreignField: "_id",
        as: "groupData",
      },
    },
    {
      $unwind: { path: "$groupData", preserveNullAndEmptyArrays: true },
    },
    {
      $group: {
        _id: "$messageId",
        messageData: {
          $first: "$$ROOT",
        },
      },
    },
    {
      $sort: {
        "messageData.createdAt": -1,
      },
    },
  ];
  let count = await PARTICIPANTMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let messageList = await PARTICIPANTMODEL.aggregate(query);

  let threadInfo = await MESSAGEMODEL.findOne({ threadId: payload.threadId });
  let groupInfo;
  let userInfo;
  if (threadInfo.groupId && threadInfo.groupId != null) {
    groupInfo = await GROUPMODEL.aggregate([
      {
        $match: {
          _id: mongoose.Types.ObjectId(threadInfo.groupId),
        },
      },
      {
        $lookup: {
          from: "users",
          localField: "users.userId",
          foreignField: "_id",
          as: "userInfo",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          createdBy: 1,
          users: 1,
          userInfo: {
            _id: 1,
            email: 1,
            image: 1,
            fullName: 1,
            firstName: 1,
            lastName: 1,
          },
        },
      },
    ]);
    groupInfo = groupInfo[0];
  } else {
    let isMatch = threadInfo.senderId.equals(user.userId)
      ? threadInfo.receiverId
      : threadInfo.senderId;

    userInfo = await USERMODEL.findOne(
      { _id: mongoose.Types.ObjectId(isMatch) },
      {
        _id: 1,
        email: 1,
        id: 1,
        firstName: 1,
        lastName: 1,
        image: 1,
        role: 1,
        fullName: 1,
      }
    );
  }
  return {
    data: messageList,
    total: total,
    groupInfo: groupInfo,
    userInfo: userInfo,
  };
};

export const clearChat = async (user, payload) => {
  let condition;
  let condition1;
  if (payload.groupId && (payload.groupId != "" || payload.groupId != null)) {
    condition = {
      threadId: payload.threadId,
      receiverId: mongoose.Types.ObjectId(user.userId),
      groupId: mongoose.Types.ObjectId(payload.groupId),
    };
    condition1 = {
      threadId: payload.threadId,
      senderId: mongoose.Types.ObjectId(user.userId),
      groupId: mongoose.Types.ObjectId(payload.groupId),
    };
  } else {
    condition = {
      threadId: payload.threadId,
      receiverId: mongoose.Types.ObjectId(user.userId),
    };
    condition1 = {
      threadId: payload.threadId,
      senderId: mongoose.Types.ObjectId(user.userId),
    };
  }
  await PARTICIPANTMODEL.updateMany(condition, {
    $set: {
      isReceiver: true,
    },
  });
  await PARTICIPANTMODEL.updateMany(condition1, {
    $set: {
      isSender: true,
    },
  });
  return true;
};

export const getAllUsers = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false };

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [
        { fullName: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };
  }

  if (user.role == 1) {
    matchObj = {
      ...matchObj,
      role: { $ne: 1 },
    };
  }

  if (user.role != 1) {
    matchObj = {
      ...matchObj,
      _id: { $ne: mongoose.Types.ObjectId(user.userId) },
    };
  }

  if (payload.role) {
    matchObj = {
      ...matchObj,
      role: payload.role,
    };
  }

  let query = [
    {
      $match: matchObj,
    },
    {
      $lookup: {
        from: "protfolios",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$driverId", "$$id"] }],
              },
            },
          },
        ],
        as: "protfolioInfo",
      },
    },
    { $unwind: { path: "$protfolioInfo", preserveNullAndEmptyArrays: true } },
    // {
    //   $lookup: {
    //     from: "participants",
    //     let: { id: "$_id" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $or: [{ $eq: ["$senderId", "$$id"] },
    //             { $eq: ["$receiverId", "$$id"] }],
    //           },
    //         },
    //       },
    //     ],
    //     as: "protfolioInfo",
    //   },
    // },
    { $sort: { createdAt: -1 } },
  ];

  let count = await USERMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let userList = await USERMODEL.aggregate(query);

  for (let i = 0; i < userList.length; i++) {
    let dataFound = await PARTICIPANTMODEL.findOne({
      type: "one2one",
      $or: [
        {
          $and: [
            {
              senderId: user.userId,
            },
            {
              receiverId: userList[i]._id,
            },
          ],
        },
        {
          $and: [
            {
              senderId: userList[i]._id,
            },
            {
              receiverId: user.userId,
            },
          ],
        },
      ],
    });
    if (dataFound) {
      userList[i].threadId = dataFound.threadId;
    } else {
      userList[i].threadId = "";
    }
  }

  let conditionMatch;

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex1 = new RegExp(`${payload["search"]}`, "i");
    conditionMatch = {
      users: { $elemMatch: { userId: mongoose.Types.ObjectId(user.userId) } },
      name: { $regex: regex1 },
    };
  } else {
    conditionMatch = {
      users: { $elemMatch: { userId: mongoose.Types.ObjectId(user.userId) } },
    };
  }

  let groupData = await GROUPMODEL.find(conditionMatch);

  for (let j = 0; j < groupData.length; j++) {
    let groupFound = await PARTICIPANTMODEL.findOne({
      groupId: groupData[j]._id,
    }).lean();
    if (groupFound && groupFound != null) {
      groupData[j].threadId = groupFound.threadId;
    } else {
      groupData[j].threadId = "";
    }
  }

  // console.log('groupData',groupData)
  return {
    data: userList,
    groupData: groupData,
    total: total,
  };
};

export const findThreadId = async (user, payload) => {
  let dataFound = await PARTICIPANTMODEL.findOne({
    type: "one2one",
    $or: [
      {
        $and: [
          {
            senderId: user.userId,
          },
          {
            receiverId: payload.userId,
          },
        ],
      },
      {
        $and: [
          {
            senderId: payload.userId,
          },
          {
            receiverId: user.userId,
          },
        ],
      },
    ],
  });
  let threadId;
  if (dataFound) {
    threadId = dataFound.threadId;
  } else {
    threadId = "";
  }
  return threadId
};
