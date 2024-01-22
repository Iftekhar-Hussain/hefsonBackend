"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadXls = exports.resetHour = exports.addEvent = exports.updateStatus = exports.getAllTrailer = exports.getDeviceMapData = exports.getMapData = exports.getDetail = exports.deleteTrailer = exports.edit = exports.add = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/trailer"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: trailer.js
 * @description: It Contain function layer for trailer controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add trailer service and perform error handling
 */
const add = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.save(req.user, payload);

    if (result.status == 400) {
      res.status(400).json((0, _response.failAction)("Sensor device is already assigned to other trailer"));
    } else {
      res.status(200).json((0, _response.successAction)(result, _messages.default.trailerAdded));
    }
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit trailer service and perform error handling
 */


exports.add = add;

const edit = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.edit(req.user, payload);

    if (result.status == 400) {
      res.status(400).json((0, _response.failAction)("Sensor device is already assigned to other trailer"));
    } else {
      res.status(200).json((0, _response.successAction)(result, _messages.default.trailerUpdated));
    }
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call soft delete trailer service and perform error handling
 */


exports.edit = edit;

const deleteTrailer = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.deleteTrailer(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.trailerDeleted));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call detail of trailer service and perform error handling
 */


exports.deleteTrailer = deleteTrailer;

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

const getMapData = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.getMapData(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getMapData = getMapData;

const getDeviceMapData = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.getDeviceMapData(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call list of all trailer service and perform error handling
 */


exports.getDeviceMapData = getDeviceMapData;

const getAllTrailer = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.getAllTrailer(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getAllTrailer = getAllTrailer;

const updateStatus = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.updateStatus(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.trailerUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add trailer event service and perform error handling
 */


exports.updateStatus = updateStatus;

const addEvent = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.addEvent(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.addEvent = addEvent;

const resetHour = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.resetHour(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.resetHour = resetHour;

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