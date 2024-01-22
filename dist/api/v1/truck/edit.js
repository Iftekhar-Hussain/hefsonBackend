"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _truck = require("../../../controllers/truck");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: edit.js
 * @description: It Contain edit truck router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/truck/edit:
 *  put:
 *   tags: ["Truck"]
 *   summary: edit truck api
 *   description: api used to edit truck
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: truck
 *        description: The truck edit api
 *        schema:
 *         type: object
 *         required:
 *          - edit truck
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
 *           manufacture:
 *             type: string
 *             required:
 *           truckColor:
 *             type: string
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
  id: _joi.default.string().trim().required().label("Truck Id"),
  unitNumber: _joi.default.string().trim().required().label("Unit Number"),
  modelYear: _joi.default.string().required().label("Model Year"),
  numberPlate: _joi.default.string().trim().required().label("Number Plate"),
  state: _joi.default.string().trim().required().label("State"),
  manufacture: _joi.default.string().trim().required().label("Manufacturer"),
  truckColor: _joi.default.string().trim().required().label("Truck Color"),
  registrationExpiry: _joi.default.string().required().label("Registation Expiry Date")
});
/*
 * api call to function
 */


app.put("/truck/edit", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _truck.edit);
var _default = app;
exports.default = _default;