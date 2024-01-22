/*
 * @file: category.js
 * @description: It Contain function layer for category service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import CATEGORYMODEL from "../collections/category";
import REQUESTCATEGORYMODEL from "../collections/requestCategory";
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
 * @description - save category to db
 */
/********** Save category **********/
export const save = async (user, payload) => {
  payload.companyId = user.userId;

  let saveData = await CATEGORYMODEL.saveCategory(payload);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - edit category to db
 */
/********** edit category **********/
export const edit = async (payload) => {
  let saveData = await CATEGORYMODEL.update(payload);

  return saveData;
};


export const editRequestCat = async (payload) => {
  let saveData = await REQUESTCATEGORYMODEL.update(payload);

  return saveData;
};


/**
 *
 * @param {*} payload
 * @description - delete category to db
 */
/********** delete category **********/
export const deleteCategory = async (payload) => {
  payload.isDeleted = true;
  let saveData = await CATEGORYMODEL.update(payload);

  return true;
};

/**
 *
 * @param {*} payload
 * @description - get category detail to db
 */
/********** get category detail**********/
export const detail = async (payload) => {
  let condition = {
    _id: payload.id,
    isDeleted: false,
    isActive: true,
  };
  let saveData = await CATEGORYMODEL.findOneByCondition(condition);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - get all catgeory list to db
 */
/********** get all category list**********/
export const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false, isActive: true };

  // if (user.role == 5) {
  //   matchObj = {
  //     ...matchObj,
  //     companyId: user.userId,
  //   };
  // }
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
    // {
    //   $lookup: {
    //     from: "users",
    //     let: { id: "$companyId" },
    //     pipeline: [
    //       {
    //         $match: {
    //           $expr: {
    //             $and: [{ $eq: ["$_id", "$$id"] }],
    //           },
    //         },
    //       },
    //     ],
    //     as: "companyInfo",
    //   },
    // },
    // { $unwind: { path: "$companyInfo", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await CATEGORYMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let categoryList = await CATEGORYMODEL.aggregate(query);
  return {
    data: categoryList,
    total: total,
  };
};

export const requestCat = async (user, payload) => {
  payload.userId = user.userId;

  let saveData = await REQUESTCATEGORYMODEL.saveCategory(payload);

  return saveData;
};

export const listRequest = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false, isApproved: false };

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
    { $sort: { createdAt: -1 } },
  ];

  let count = await REQUESTCATEGORYMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let categoryList = await REQUESTCATEGORYMODEL.aggregate(query);
  return {
    data: categoryList,
    total: total,
  };
};

export const updateStatus = async (payload) => {
  let saveData = await CATEGORYMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(payload.id) },
    {
      $set: {
        isActive: payload.status,
      },
    },
    {
      new: true,
    }
  );

  return saveData;
};

export const approveRequestCat = async (payload) => {
  let saveData = await REQUESTCATEGORYMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(payload.id) },
    {
      $set: {
        isActive: true,
        isApproved: true,
      },
    }
  );

  return saveData;
};
