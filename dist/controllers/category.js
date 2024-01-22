"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.approveRequestCat = exports.updateStatus = exports.listRequest = exports.list = exports.detail = exports.deleteCategory = exports.editRequestCat = exports.edit = exports.requestCat = exports.add = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/category"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: category.js
 * @description: It Contain function layer for category controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add category service and perform error handling
 */
const add = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.save(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.categoryAdded));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.add = add;

const requestCat = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.requestCat(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.categoryRequested));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
*
* @param {*} req
* @param {*} res
* @param {*} next
* @description - controller to call edit category service and perform error handling
*/


exports.requestCat = requestCat;

const edit = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.edit(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.categoryUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.edit = edit;

const editRequestCat = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.editRequestCat(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.categoryUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
*
* @param {*} req
* @param {*} res
* @param {*} next
* @description - controller to call soft delete category service and perform error handling
*/


exports.editRequestCat = editRequestCat;

const deleteCategory = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.deleteCategory(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.delCat));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
}; //   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call detail of trailer service and perform error handling
//    */


exports.deleteCategory = deleteCategory;

const detail = async (req, res, next) => {
  const payload = req.params;

  try {
    const result = await SERVICE.detail(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
}; //   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call list of all catgeory service and perform error handling
//    */


exports.detail = detail;

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

const listRequest = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.listRequest(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.listRequest = listRequest;

const updateStatus = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.updateStatus(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.categoryUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.updateStatus = updateStatus;

const approveRequestCat = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.approveRequestCat(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.categoryUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.approveRequestCat = approveRequestCat;