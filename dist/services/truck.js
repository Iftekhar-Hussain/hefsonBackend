"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatus = exports.getAllTrucks = exports.getDetail = exports.deleteTruck = exports.edit = exports.save = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _truck = _interopRequireDefault(require("../collections/truck"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: user.js
 * @description: It Contain function layer for truck service.
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
 * @description - save truck to db
 */

/********** Save truck **********/


const save = async (user, payload) => {
  payload.carrierId = user.userId;
  let saveData = await _truck.default.saveTruck(payload);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - edit truck to db
 */

/********** edit truck **********/


exports.save = save;

const edit = async (user, payload) => {
  let saveData = await _truck.default.update(payload);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - delete truck to db
 */

/********** delete truck **********/


exports.edit = edit;

const deleteTruck = async payload => {
  payload.isDeleted = true;
  let saveData = await _truck.default.update(payload);
  return true;
};
/**
 *
 * @param {*} payload
 * @description - get truck detail to db
 */

/********** get truck detail**********/


exports.deleteTruck = deleteTruck;

const getDetail = async payload => {
  let condition = {
    _id: _mongoose.default.Types.ObjectId(payload.id),
    isDeleted: false
  };
  let query = [{
    $match: condition
  }, {
    $lookup: {
      from: "manufactures",
      let: {
        id: "$manufacture"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$_id", "$$id"]
            }]
          }
        }
      }],
      as: "manufactureInfo"
    }
  }, {
    $unwind: {
      path: "$manufactureInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let saveData = await _truck.default.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);

  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - get all truck list to db
 */

/********** get all truck list**********/


exports.getDetail = getDetail;

const getAllTrucks = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false
  };

  if (user.role == 2) {
    matchObj = { ...matchObj,
      carrierId: _mongoose.default.Types.ObjectId(user.userId)
    };
  }

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = { ...matchObj,
      $or: [{
        unitNumber: {
          $regex: regex
        }
      }]
    };
  }

  let query = [{
    $match: matchObj
  }, {
    $lookup: {
      from: "manufactures",
      let: {
        id: "$manufacture"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$_id", "$$id"]
            }]
          }
        }
      }],
      as: "manufactureInfo"
    }
  }, {
    $unwind: {
      path: "$manufactureInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "users",
      let: {
        id: "$carrierId"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$_id", "$$id"]
            }]
          }
        }
      }],
      as: "carrierInfo"
    }
  }, {
    $unwind: {
      path: "$carrierInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _truck.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let truckList = await _truck.default.aggregate(query);
  return {
    data: truckList,
    total: total
  };
};

exports.getAllTrucks = getAllTrucks;

const updateStatus = async (user, payload) => {
  let saveData = await _truck.default.update(payload);
  return saveData;
};

exports.updateStatus = updateStatus;