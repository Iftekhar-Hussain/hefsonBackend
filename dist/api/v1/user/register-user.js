"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = require("../../../controllers/user");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: register.js
 * @description: It Contain register User  router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *   tags: ["User"]
 *   summary: register user api
 *   description: api used to register user
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *         type: object
 *         required:
 *          - user register
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required:
 *           role:
 *             type: number
 *             required:
 *           deviceId:
 *             type: string
 *             required:
 *           deviceType:
 *             type: string
 *             required:
 *           fullName:
 *             type: string
 *             required:
 *           licenseNo:
 *             type: string
 *             required:
 *           businessName:
 *             type: string
 *             required:
 *           dotNumber:
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
  email: _joi.default.string().email().trim().required().label("Email"),
  password: _joi.default.string().trim().required().label("Password"),
  role: _joi.default.number().required().label("Role"),
  deviceId: _joi.default.string().trim().allow("").label("Device Token"),
  deviceType: _joi.default.string().trim().allow("").label("Device type"),
  fullName: _joi.default.string().trim().required().label("Full Name"),
  licenseNo: _joi.default.string().trim().allow("").label("License No"),
  businessName: _joi.default.string().trim().label("Business Name"),
  dotNumber: _joi.default.string().trim().label("DOT Number")
});
/*
 * api call to function
 */


app.post("/user/register", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _user.registerUser);
var _default = app;
exports.default = _default;