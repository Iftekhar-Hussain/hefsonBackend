"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _device = require("../../../controllers/device");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: edit.js
 * @description: It Contain edit category router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/device/assignSensor:
 *  put:
 *   tags: ["Device"]
 *   summary: assign sensor api
 *   description: api used to assign sensor
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: category
 *        description: The category edit api
 *        schema:
 *         type: object
 *         required:
 *          - edit category
 *         properties:
 *           sensorId:
 *             type: string
 *             required:
 *           userId:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * Joi validation on input data
 */

const Schema = _joi.default.object({
  sensorId: _joi.default.string().trim().required().label("Sensor Id"),
  userId: _joi.default.string().required().label("User Id")
});
/*
 * api call to function
 */


app.put("/device/assignSensor", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _device.assignSensor);
var _default = app;
exports.default = _default;