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
 * @file: active.js
 * @description: It Contain active list of Shipment router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/shipment/updateStatus:
 *  post:
 *   tags: ["Shipment"]
 *   summary: list active Shipment api
 *   description: api used to list active Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: get shipment list active
 *        schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *           status:
 *              type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = _joi.default.object({
  id: _joi.default.string().required().label("Shipment Id"),
  status: _joi.default.string().required().label("complete / cancel")
});

app.post("/shipment/updateStatus", validator.body(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _shipment.updateStatus);
var _default = app;
exports.default = _default;