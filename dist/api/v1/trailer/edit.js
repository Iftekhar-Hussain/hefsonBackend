"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _trailer = require("../../../controllers/trailer");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: edit.js
 * @description: It Contain edit trailer router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/trailer/edit:
 *  put:
 *   tags: ["Trailer"]
 *   summary: edit trailer api
 *   description: api used to edit trailer
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer edit api
 *        schema:
 *         type: object
 *         required:
 *          - edit trailer
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           unitNumber:
 *             type: string
 *             required:
 *           modelYear:
 *             type: string
 *             required:
 *           numberPlate:
 *             type: string
 *             required:
 *           state:
 *             type: string
 *             required:
 *           manufacturer:
 *             type: string
 *             required:
 *           sensorId:
 *             type: string
 *             required:
 *           engineHours:
 *             type: number
 *             required:
 *           registrationExpiry:
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
  id: _joi.default.string().trim().required().label("Trailer Id"),
  unitNumber: _joi.default.string().trim().required().label("Unit Number"),
  modelYear: _joi.default.string().required().label("Model Year"),
  numberPlate: _joi.default.string().trim().required().label("Number Plate"),
  state: _joi.default.string().trim().required().label("State"),
  manufacturer: _joi.default.string().trim().required().label("Manufacturer"),
  sensorId: _joi.default.string().trim().required().label("Sensor Id"),
  engineHours: _joi.default.number().required().label("Engine Hours"),
  registrationExpiry: _joi.default.string().required().label("Registation Expiry Date")
});
/*
 * api call to function
 */


app.put("/trailer/edit", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _trailer.edit);
var _default = app;
exports.default = _default;