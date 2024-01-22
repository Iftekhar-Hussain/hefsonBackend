"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approveRequestCat = exports.updateStatus = exports.listRequest = exports.requestCat = exports.list = exports.detail = exports.deleteCategory = exports.editRequestCat = exports.edit = exports.save = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _category = _interopRequireDefault(require("../collections/category"));

var _requestCategory = _interopRequireDefault(require("../collections/requestCategory"));

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
 * @description - save category to db
 */

/********** Save category **********/


const save = async (user, payload) => {
  payload.companyId = user.userId;
  let saveData = await _category.default.saveCategory(payload);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - edit category to db
 */

/********** edit category **********/


exports.save = save;

const edit = async payload => {
  let saveData = await _category.default.update(payload);
  return saveData;
};

exports.edit = edit;

const editRequestCat = async payload => {
  let saveData = await _requestCategory.default.update(payload);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - delete category to db
 */

/********** delete category **********/


exports.editRequestCat = editRequestCat;

const deleteCategory = async payload => {
  payload.isDeleted = true;
  let saveData = await _category.default.update(payload);
  return true;
};
/**
 *
 * @param {*} payload
 * @description - get category detail to db
 */

/********** get category detail**********/


exports.deleteCategory = deleteCategory;

const detail = async payload => {
  let condition = {
    _id: payload.id,
    isDeleted: false,
    isActive: true
  };
  let saveData = await _category.default.findOneByCondition(condition);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - get all catgeory list to db
 */

/********** get all category list**********/


exports.detail = detail;

const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false,
    isActive: true
  }; // if (user.role == 5) {
  //   matchObj = {
  //     ...matchObj,
  //     companyId: user.userId,
  //   };
  // }

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
  }, // {
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
  {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _category.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let categoryList = await _category.default.aggregate(query);
  return {
    data: categoryList,
    total: total
  };
};

exports.list = list;

const requestCat = async (user, payload) => {
  payload.userId = user.userId;
  let saveData = await _requestCategory.default.saveCategory(payload);
  return saveData;
};

exports.requestCat = requestCat;

const listRequest = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false,
    isApproved: false
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
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _requestCategory.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let categoryList = await _requestCategory.default.aggregate(query);
  return {
    data: categoryList,
    total: total
  };
};

exports.listRequest = listRequest;

const updateStatus = async payload => {
  let saveData = await _category.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.id)
  }, {
    $set: {
      isActive: payload.status
    }
  }, {
    new: true
  });
  return saveData;
};

exports.updateStatus = updateStatus;

const approveRequestCat = async payload => {
  let saveData = await _requestCategory.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.id)
  }, {
    $set: {
      isActive: true,
      isApproved: true
    }
  });
  return saveData;
};

exports.approveRequestCat = approveRequestCat;