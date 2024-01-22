"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _qrcode = _interopRequireDefault(require("../collections/qrcode"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: category.js
 * @description: It Contain function layer for category service.
 * @author: Aditi Goel
 */
const imagePath = "./public/images/";
const videoPath = "./public/uploads/";

const {
  frontendUrl,
  logoUrl
} = _config.default.get("app");

const moment = require("moment");
/**
 *
 * @param {*} payload
 * @description - get all qrcode list to db
 */

/********** get all category list**********/


const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false,
    isActive: true
  };

  if (user.role == 5) {
    matchObj = { ...matchObj,
      companyId: user.userId
    };
  } //   if (payload.search) {
  //     payload.search = payload.search.toLowerCase();
  //     const regex = new RegExp(`${payload["search"]}`, "i");
  //     matchObj = {
  //       ...matchObj,
  //       $or: [{ name: { $regex: regex } }],
  //     };
  //   }


  let query = [{
    $match: matchObj
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _qrcode.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let qrList = await _qrcode.default.aggregate(query);
  return {
    data: qrList,
    total: total
  };
};

exports.list = list;