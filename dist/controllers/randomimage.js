"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.deleteRandomImage = exports.updateImage = exports.listRandomimage = exports.uploadImage = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/randomimage"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: randomimage.js
 * @description: It Contain function layer for randomimage controller.
 * @author: Ankit Kumar Gautam
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call upload randomimage service and perform error handling
 */
const uploadImage = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.userId = req.user.userId;
    payload.files = req.files;
    payload.appUrl = `${req.protocol}://${req.headers.host}`;
    const data = await SERVICE.uploadImage(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.randomImageUpload));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call list shipment service and perform error handling
 */


exports.uploadImage = uploadImage;

const listRandomimage = async (req, res, next) => {
  const payload = req.body;

  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listRandomimage(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update Shipment service and perform error handling
 */


exports.listRandomimage = listRandomimage;

const updateImage = async (req, res, next) => {
  const payload = req.body;
  payload.userId = req.user.userId;

  try {
    const result = await SERVICE.updateImage(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.userUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call delete Random Image service and perform error handling
 */


exports.updateImage = updateImage;

const deleteRandomImage = async (req, res, next) => {
  const payload = req.body;
  payload.isDeleted = true;

  try {
    const result = await SERVICE.deleteRandomImage(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.userUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.deleteRandomImage = deleteRandomImage;