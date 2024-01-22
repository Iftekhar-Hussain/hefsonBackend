"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _universal = require("../../../utilities/universal");

var _chat = require("../../../controllers/chat");

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
 * /api/v1/chat/createGroup:
 *  post:
 *   tags: ["Chat"]
 *   summary: add Shipment api
 *   description: api used to add Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: driver
 *        description: The driver to update.
 *        schema:
 *         type: object
 *         required:
 *          - driver update
 *         properties:
 *           name:
 *             type: string
 *             required:
 *           users:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 userId:
 *                    type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = _joi.default.object({
  name: _joi.default.string().label("Group Name"),
  users: _joi.default.array().items(_joi.default.object({
    userId: _joi.default.string().label("userIds")
  }))
});

app.post("/chat/createGroup", validator.body(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _chat.createGroup);
var _default = app;
exports.default = _default;