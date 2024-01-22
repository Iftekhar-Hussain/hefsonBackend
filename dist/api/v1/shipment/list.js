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
 * /api/v1/shipment/list:
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
 *           pageNum:
 *              type: number
 *           limit:
 *             type: number
 *           sortBy:
 *             type: string
 *           sortValue:
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
  pageNum: _joi.default.number().required().label("Page Number"),
  limit: _joi.default.number().required().label("Limit"),
  sortBy: _joi.default.string().label("Sort By"),
  sortValue: _joi.default.number().label("Sort value"),
  status: _joi.default.string().optional().allow("").label("Status - active / complete")
});

app.post("/shipment/list", validator.body(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _shipment.listShipment);
var _default = app;
exports.default = _default;