/*
 * @file: category.js
 * @description: It Contain function layer for category service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import QRMODEL from "../collections/qrcode";
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

/**
 *
 * @param {*} payload
 * @description - get all qrcode list to db
 */
/********** get all category list**********/
export const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false, isActive: true };

  if (user.role == 5) {
    matchObj = {
      ...matchObj,
      companyId: user.userId,
    };
  }
  //   if (payload.search) {
  //     payload.search = payload.search.toLowerCase();
  //     const regex = new RegExp(`${payload["search"]}`, "i");
  //     matchObj = {
  //       ...matchObj,
  //       $or: [{ name: { $regex: regex } }],
  //     };
  //   }

  let query = [
    {
      $match: matchObj,
    },
    { $sort: { createdAt: -1 } },
  ];

  let count = await QRMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let qrList = await QRMODEL.aggregate(query);
  return {
    data: qrList,
    total: total,
  };
};
