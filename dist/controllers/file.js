"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.uploadImage = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/file"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: file.js
 * @description: It Contain function layer for file controller.
 * @author: Ankit Kumar Gautam
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call upload file service and perform error handling
 */
const uploadImage = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.userId = req.user.userId;
    payload.files = req.files;
    payload.appUrl = `${req.protocol}://${req.headers.host}`;
    const data = await SERVICE.uploadImage(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.fileUpload));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.uploadImage = uploadImage;