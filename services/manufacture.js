/*
 * @file: manufacture.js
 * @description: It Contain function layer for manufacture service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import MANUFACTUREMODEL from "../collections/manufacture";
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
 * @description - get all manufacture list to db
 */
/********** get all manufcture list**********/
export const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  payload.type = payload.type ? payload.type : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false, isActive: true, type: payload.type };

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [{ name: { $regex: regex } }],
    };
  }

  let query = [
    {
      $match: matchObj,
    },
  ];

  let count = await MANUFACTUREMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let manuList = await MANUFACTUREMODEL.aggregate(query);
  return {
    data: manuList,
    total: total,
  };
};
