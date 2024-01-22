/*
 * @file: user.js
 * @description: It Contain function layer for truck service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import TRUCKMODEL from "../collections/truck";
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
 * @description - save truck to db
 */
/********** Save truck **********/
export const save = async (user, payload) => {
  payload.carrierId = user.userId;

  let saveData = await TRUCKMODEL.saveTruck(payload);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - edit truck to db
 */
/********** edit truck **********/
export const edit = async (user, payload) => {
  let saveData = await TRUCKMODEL.update(payload);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - delete truck to db
 */
/********** delete truck **********/
export const deleteTruck = async (payload) => {
  payload.isDeleted = true;
  let saveData = await TRUCKMODEL.update(payload);

  return true;
};

/**
 *
 * @param {*} payload
 * @description - get truck detail to db
 */
/********** get truck detail**********/
export const getDetail = async (payload) => {
  let condition = {
    _id: mongoose.Types.ObjectId(payload.id),
    isDeleted: false
  };

  let query = [
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "manufactures",
        let: { id: "$manufacture" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$id"] }],
              },
            },
          },
        ],
        as: "manufactureInfo",
      },
    },
    { $unwind: { path: "$manufactureInfo", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let saveData = await TRUCKMODEL.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - get all truck list to db
 */
/********** get all truck list**********/
export const getAllTrucks = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false};

  if (user.role == 2) {
    matchObj = {
      ...matchObj,
      carrierId: mongoose.Types.ObjectId(user.userId),
    };
  }
  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [{ unitNumber: { $regex: regex } }],
    };
  }

  let query = [
    {
      $match: matchObj,
    },
    {
      $lookup: {
        from: "manufactures",
        let: { id: "$manufacture" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$id"] }],
              },
            },
          },
        ],
        as: "manufactureInfo",
      },
    },
    { $unwind: { path: "$manufactureInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        let: { id: "$carrierId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$id"] }],
              },
            },
          },
        ],
        as: "carrierInfo",
      },
    },
    { $unwind: { path: "$carrierInfo", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await TRUCKMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let truckList = await TRUCKMODEL.aggregate(query);
  return {
    data: truckList,
    total: total,
  };
};

export const updateStatus = async (user, payload) => {
  let saveData = await TRUCKMODEL.update(payload);

  return saveData;
};
