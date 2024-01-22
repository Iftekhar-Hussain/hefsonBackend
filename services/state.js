/*
 * @file: category.js
 * @description: It Contain function layer for category service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import STATEMODEL from "../collections/state";
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
export const list = async (payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false, isActive: true };

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [
        { country: { $regex: regex } },
        { "state.name": { $regex: regex } },
      ],
    };
  }

  let query = [
    {
      $match: matchObj,
    },
  ];

  let count = await STATEMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let stateList = await STATEMODEL.aggregate(query);
  return {
    stateList,
    total: total,
  };
};
