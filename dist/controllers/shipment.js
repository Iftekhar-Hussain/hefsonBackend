"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareLink = exports.downloadXls = exports.listAlarm = exports.listInactiveShipment = exports.listActiveShipment = exports.deleteShipment = exports.updateStatus = exports.updateShipment = exports.completeShipmentDetail = exports.detailShipment = exports.listShipment = exports.addShipment = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/shipment"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: shipment.js
 * @description: It Contain function layer for shipment controller.
 * @author: Ankit Kumar Gautam
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add shipment service and perform error handling
 */
const addShipment = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.carrierId = req.user.userId;
    const data = await SERVICE.addShipment(payload);

    if (data.status == 400) {
      if (data.message == "trailer") {
        res.status(400).json((0, _response.failAction)("Trailer is already in use"));
      } else {
        res.status(400).json((0, _response.failAction)("Truck is already in use"));
      }
    } else {
      res.status(200).json((0, _response.successAction)(data, _messages.default.shipmentAdded));
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
 * @description - controller to call list shipment service and perform error handling
 */


exports.addShipment = addShipment;

const listShipment = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.listShipment(req.user, payload);
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
 * @description - controller to call detail shipment service and perform error handling
 */


exports.listShipment = listShipment;

const detailShipment = async (req, res, next) => {
  const payload = req.query;

  try {
    // payload.userId = req.user.userId;
    const data = await SERVICE.detailShipment(req.user, payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.detailShipment = detailShipment;

const completeShipmentDetail = async (req, res, next) => {
  const payload = req.query;

  try {
    // payload.userId = req.user.userId;
    const data = await SERVICE.completeShipmentDetail(req.user, payload);
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


exports.completeShipmentDetail = completeShipmentDetail;

const updateShipment = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.carrierId = req.user.userId;
    const data = await SERVICE.updateShipment(payload);

    if (data.status == 400) {
      if (data.message == "trailer") {
        res.status(400).json((0, _response.failAction)("Trailer is already in use"));
      } else {
        res.status(400).json((0, _response.failAction)("Truck is already in use"));
      }
    } else {
      res.status(200).json((0, _response.successAction)(data, _messages.default.success));
    }
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.updateShipment = updateShipment;

const updateStatus = async (req, res, next) => {
  const payload = req.body;
  payload.userId = req.user.userId;

  try {
    const result = await SERVICE.updateStatus(payload);
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
 * @description - controller to call delete Shipment service and perform error handling
 */


exports.updateStatus = updateStatus;

const deleteShipment = async (req, res, next) => {
  const payload = req.body;
  payload.isDeleted = true;

  try {
    const result = await SERVICE.deleteShipment(payload);
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
 * @description - controller to call active shipment service and perform error handling
 */


exports.deleteShipment = deleteShipment;

const listActiveShipment = async (req, res, next) => {
  const payload = req.body;

  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listActiveShipment(payload);
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
 * @description - controller to call inactive shipment service and perform error handling
 */


exports.listActiveShipment = listActiveShipment;

const listInactiveShipment = async (req, res, next) => {
  const payload = req.body;

  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listInactiveShipment(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.listInactiveShipment = listInactiveShipment;

const listAlarm = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.listAlarm(req.user, payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.listAlarm = listAlarm;

const downloadXls = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.downloadxls(req.user, payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.downloadXls = downloadXls;

const shareLink = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.shareLink(req.user, payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.shareLink = shareLink;