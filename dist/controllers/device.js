"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadXls = exports.assignSensor = exports.getDetail = exports.list = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/device"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: truck.js
 * @description: It Contain function layer for devices controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to get list of alldevices
 */
const list = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.list(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.devicelist));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.list = list;

const getDetail = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.getDetail(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getDetail = getDetail;

const assignSensor = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.assignSensor(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.assignSensor = assignSensor;

const downloadXls = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.downloadxls(req.user, payload);
    console.log('data1', data);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.downloadXls = downloadXls;