"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.updateStatus = exports.getAllTrucks = exports.getDetail = exports.deleteTruck = exports.edit = exports.add = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/truck"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: truck.js
 * @description: It Contain function layer for truck controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add truck service and perform error handling
 */
const add = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.save(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.truckAdded));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit truck service and perform error handling
 */


exports.add = add;

const edit = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.edit(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.truckUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call soft delete truck service and perform error handling
 */


exports.edit = edit;

const deleteTruck = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.deleteTruck(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.truckDeleted));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call detail of truck service and perform error handling
 */


exports.deleteTruck = deleteTruck;

const getDetail = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.getDetail(payload);
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
 * @description - controller to call list of all truck service and perform error handling
 */


exports.getDetail = getDetail;

const getAllTrucks = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.getAllTrucks(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getAllTrucks = getAllTrucks;

const updateStatus = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.updateStatus(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.truckUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.updateStatus = updateStatus;