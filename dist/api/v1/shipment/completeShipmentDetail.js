"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _universal = require("../../../utilities/universal");

var _shipment = require("../../../controllers/shipment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: detail.js
 * @description: It Contain detail Shipment router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/shipment/completeShipmentDetail:
 *  get:
 *   tags: ["Shipment"]
 *   summary: detail Shipment api
 *   description: api used to detail Shipment
 *   parameters:
 *     - in: query
 *       name: id
 *       required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = _joi.default.object({
  id: _joi.default.string().optional().allow("").label("Search")
});

app.get("/shipment/completeShipmentDetail", validator.query(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), // checkTokenCommon,
_shipment.completeShipmentDetail);
var _default = app;
exports.default = _default;