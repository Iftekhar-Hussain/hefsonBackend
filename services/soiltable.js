/*
 * @file: soiltable.js
 * @description: It Contain function layer for soiltable service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import SOILTABLEMODEL from "../collections/soiltable";
import QRMODEL from "../collections/qrcode";
import CATEGORYMODEL from "../collections/category";
import SLUG from "slug";
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
import QRCode from "qrcode";
import { converBase64ToImage } from "convert-base64-to-image";
import file from "../api/v1/file";
const { frontendUrl, logoUrl } = config.get("app");
const moment = require("moment");
import { uploadFile } from "../utilities/universal";
import { createCanvas, loadImage } from "canvas";

/**
 *
 * @param {*} payload
 * @description - save soiltable to db
 */
/********** Save soiltable **********/
export const save = async (user, payload) => {
  payload.companyId = user.userId;
  payload.code = generateRandom(8, true);
  payload.slug = SLUG(payload.code + "-" + payload.name);
  let qrLink = frontendUrl + "soiltable/" + payload.slug;
  //let qr = await QRCode.toDataURL(qrLink);

  const canvas = createCanvas(200, 200);
  const ctx = canvas.getContext("2d");

  await QRCode.toCanvas(canvas, qrLink, {
    width: 200,
  });

  const image = await loadImage(
    "https://hefson.s3.ca-central-1.amazonaws.com/qrlogo/1689071987063-innerLogo.png"
  );

  const center = (200 - 26) / 2;
  ctx.drawImage(image, center, center, 26, 26);
  let qr = canvas.toDataURL();

  let fileName = `${Date.now()}-${payload.code}`;
  fileName = fileName + ".png";
  /*********  Upload Image File *********/
  let src = `public/uploads/${fileName}`;

  const path = converBase64ToImage(qr, src);

  let fileData = await uploadFile("image/png", src, "qrcode/" + fileName);

  let saveData = await SOILTABLEMODEL.saveSoiltable(payload);

  let qrObj = {
    companyId: user.userId,
    base64: qr,
    image: fileData,
    soiltableId: saveData._id,
  };
  let saveQr = await QRMODEL.saveQrcode(qrObj);

  return await SOILTABLEMODEL.aggregate([
    {
      $match: { _id: mongoose.Types.ObjectId(saveData._id) },
    },
    {
      $lookup: {
        from: "qrcodes",
        localField: "_id",
        foreignField: "soiltableId",
        as: "qrData",
      },
    },
    { $unwind: "$qrData" },
  ]);
};

/**
 *
 * @param {*} payload
 * @description - save soiltable to db
 */
/********** Save soiltable **********/
export const update = async (user, payload) => {
  let saveData = await SOILTABLEMODEL.update(payload);
  return saveData;
};

export const approveProduct = async (user, payload) => {
  let saveData = await SOILTABLEMODEL.findOneAndUpdate(
    { _id: payload.id },
    {
      $set: {
        isActive: payload.status,
      },
    },
    { new: true }
  );
  return saveData;
};

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
  let matchObj = {
    isDeleted: false,
    categoryId: mongoose.Types.ObjectId(payload.categoryId),
  };

  if (user.role != 1) {
    matchObj = {
      ...matchObj,
      companyId: mongoose.Types.ObjectId(user.userId),
    };
  }
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
    {
      $lookup: {
        from: "qrcodes",
        localField: "_id",
        foreignField: "soiltableId",
        as: "qrData",
      },
    },
    { $unwind: "$qrData" },
    { $sort: { createdAt: -1 } },
  ];

  let count = await SOILTABLEMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let soiltableList = await SOILTABLEMODEL.aggregate(query);
  return {
    data: soiltableList,
    total: total,
  };
};

export const detailSoiltable = async (user, payload) => {
  return await SOILTABLEMODEL.aggregate([
    {
      $match: { slug: payload.id },
    },
    {
      $lookup: {
        from: "qrcodes",
        localField: "_id",
        foreignField: "soiltableId",
        as: "qrData",
      },
    },
    { $unwind: "$qrData" },
  ]);
};

export const userCategory = async (user, payload) => {
  let ids = await SOILTABLEMODEL.distinct("categoryId", {
    companyId: mongoose.Types.ObjectId(user.userId),
  });

  return await CATEGORYMODEL.find({ _id: { $in: ids } });
};

export const addTimeline = async (user, payload) => {
  return await SOILTABLEMODEL.findOneAndUpdate(
    { _id: payload.id },
    {
      $push: {
        timeline: {
          processingDate: payload.processingDate,
          processingTime: payload.processingTime,
          status: payload.status,
          location: payload.location,
        },
      },
    },
    { new: true }
  );
};
