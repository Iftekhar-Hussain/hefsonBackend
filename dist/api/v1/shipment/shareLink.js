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
 * @file: addShipment.js
 * @description: It Contain addShipment router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/shipment/shareLink:
 *  post:
 *   tags: ["Shipment"]
 *   summary: add Shipment api
 *   description: api used to add Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: body
 *        name: driver
 *        description: The driver to update.
 *        schema:
 *         type: object
 *         required:
 *          - driver update
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           url:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = _joi.default.object({
  email: _joi.default.string().label("Email Id"),
  url: _joi.default.string().label("Share Url")
});

app.post("/shipment/shareLink", validator.body(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _shipment.shareLink);
var _default = app;
exports.default = _default;