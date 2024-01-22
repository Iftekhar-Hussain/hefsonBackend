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
 * @file: list.js
 * @description: It Contain list Shipment router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/shipment/listAlarm:
 *  post:
 *   tags: ["Shipment"]
 *   summary: list Shipment api
 *   description: api used to list Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: get shipment list
 *        schema:
 *         type: object
 *         properties:
 *           search:
 *             type: string
 *           page:
 *              type: number
 *           limit:
 *             type: number
 *           status:
 *             type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = _joi.default.object({
  search: _joi.default.string().optional().allow("").label("Search"),
  page: _joi.default.number().required().label("Page Number"),
  limit: _joi.default.number().required().label("Limit"),
  status: _joi.default.string().optional().allow("").label("Status - current / past")
});

app.post("/shipment/listAlarm", validator.body(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _shipment.listAlarm);
var _default = app;
exports.default = _default;