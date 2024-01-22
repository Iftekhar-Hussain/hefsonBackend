"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.addTimeline = exports.userCategory = exports.detailSoiltable = exports.list = exports.approveProduct = exports.edit = exports.add = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/soiltable"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: soiltable.js
 * @description: It Contain function layer for soiltable controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add soiltable service and perform error handling
 */
const add = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.save(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.soiltableAdded));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit soiltable service and perform error handling
 */


exports.add = add;

const edit = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.update(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.soiltableUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.edit = edit;

const approveProduct = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.approveProduct(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.soiltableUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
}; //   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call list of all soiltable service and perform error handling
//    */


exports.approveProduct = approveProduct;

const list = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.list(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.list = list;

const detailSoiltable = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.detailSoiltable(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.detailSoiltable = detailSoiltable;

const userCategory = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.userCategory(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.userCategory = userCategory;

const addTimeline = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.addTimeline(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.soiltableAdded));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.addTimeline = addTimeline;