"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.list = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _manufacture = _interopRequireDefault(require("../collections/manufacture"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: manufacture.js
 * @description: It Contain function layer for manufacture service.
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
 * @description - get all manufacture list to db
 */

/********** get all manufcture list**********/


const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  payload.type = payload.type ? payload.type : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false,
    isActive: true,
    type: payload.type
  };

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = { ...matchObj,
      $or: [{
        name: {
          $regex: regex
        }
      }]
    };
  }

  let query = [{
    $match: matchObj
  }];
  let count = await _manufacture.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let manuList = await _manufacture.default.aggregate(query);
  return {
    data: manuList,
    total: total
  };
};

exports.list = list;