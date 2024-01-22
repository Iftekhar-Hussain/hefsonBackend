"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTimeline = exports.userCategory = exports.detailSoiltable = exports.list = exports.approveProduct = exports.update = exports.save = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _soiltable = _interopRequireDefault(require("../collections/soiltable"));

var _qrcode = _interopRequireDefault(require("../collections/qrcode"));

var _category = _interopRequireDefault(require("../collections/category"));

var _slug = _interopRequireDefault(require("slug"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

var _qrcode2 = _interopRequireDefault(require("qrcode"));

var _convertBase64ToImage = require("convert-base64-to-image");

var _file = _interopRequireDefault(require("../api/v1/file"));

var _canvas = require("canvas");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: soiltable.js
 * @description: It Contain function layer for soiltable service.
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
 * @description - save soiltable to db
 */

/********** Save soiltable **********/
const save = async (user, payload) => {
  payload.companyId = user.userId;
  payload.code = (0, _universal.generateRandom)(8, true);
  payload.slug = (0, _slug.default)(payload.code + "-" + payload.name);
  let qrLink = frontendUrl + "soiltable/" + payload.slug; //let qr = await QRCode.toDataURL(qrLink);

  const canvas = (0, _canvas.createCanvas)(200, 200);
  const ctx = canvas.getContext("2d");
  await _qrcode2.default.toCanvas(canvas, qrLink, {
    width: 200
  });
  const image = await (0, _canvas.loadImage)("https://hefson.s3.ca-central-1.amazonaws.com/qrlogo/1689071987063-innerLogo.png");
  const center = (200 - 26) / 2;
  ctx.drawImage(image, center, center, 26, 26);
  let qr = canvas.toDataURL();
  let fileName = `${Date.now()}-${payload.code}`;
  fileName = fileName + ".png";
  /*********  Upload Image File *********/

  let src = `public/uploads/${fileName}`;
  const path = (0, _convertBase64ToImage.converBase64ToImage)(qr, src);
  let fileData = await (0, _universal.uploadFile)("image/png", src, "qrcode/" + fileName);
  let saveData = await _soiltable.default.saveSoiltable(payload);
  let qrObj = {
    companyId: user.userId,
    base64: qr,
    image: fileData,
    soiltableId: saveData._id
  };
  let saveQr = await _qrcode.default.saveQrcode(qrObj);
  return await _soiltable.default.aggregate([{
    $match: {
      _id: _mongoose.default.Types.ObjectId(saveData._id)
    }
  }, {
    $lookup: {
      from: "qrcodes",
      localField: "_id",
      foreignField: "soiltableId",
      as: "qrData"
    }
  }, {
    $unwind: "$qrData"
  }]);
};
/**
 *
 * @param {*} payload
 * @description - save soiltable to db
 */

/********** Save soiltable **********/


exports.save = save;

const update = async (user, payload) => {
  let saveData = await _soiltable.default.update(payload);
  return saveData;
};

exports.update = update;

const approveProduct = async (user, payload) => {
  let saveData = await _soiltable.default.findOneAndUpdate({
    _id: payload.id
  }, {
    $set: {
      isActive: payload.status
    }
  }, {
    new: true
  });
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - get all qrcode list to db
 */

/********** get all category list**********/


exports.approveProduct = approveProduct;

const list = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false,
    categoryId: _mongoose.default.Types.ObjectId(payload.categoryId)
  };

  if (user.role != 1) {
    matchObj = { ...matchObj,
      companyId: _mongoose.default.Types.ObjectId(user.userId)
    };
  }

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
    $lookup: {
      from: "qrcodes",
      localField: "_id",
      foreignField: "soiltableId",
      as: "qrData"
    }
  }, {
    $unwind: "$qrData"
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _soiltable.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let soiltableList = await _soiltable.default.aggregate(query);
  return {
    data: soiltableList,
    total: total
  };
};

exports.list = list;

const detailSoiltable = async (user, payload) => {
  return await _soiltable.default.aggregate([{
    $match: {
      slug: payload.id
    }
  }, {
    $lookup: {
      from: "qrcodes",
      localField: "_id",
      foreignField: "soiltableId",
      as: "qrData"
    }
  }, {
    $unwind: "$qrData"
  }]);
};

exports.detailSoiltable = detailSoiltable;

const userCategory = async (user, payload) => {
  let ids = await _soiltable.default.distinct("categoryId", {
    companyId: _mongoose.default.Types.ObjectId(user.userId)
  });
  return await _category.default.find({
    _id: {
      $in: ids
    }
  });
};

exports.userCategory = userCategory;

const addTimeline = async (user, payload) => {
  return await _soiltable.default.findOneAndUpdate({
    _id: payload.id
  }, {
    $push: {
      timeline: {
        processingDate: payload.processingDate,
        processingTime: payload.processingTime,
        status: payload.status,
        location: payload.location
      }
    }
  }, {
    new: true
  });
};

exports.addTimeline = addTimeline;