"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = require("../../../controllers/user");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _universal = require("../../../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: register.js
 * @description: It Contain register or add Driver api.
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});

/**
 * @swagger
 * /api/v1/driver/addDriver:
 *  post:
 *   tags: ["Driver"]
 *   summary: register or add driver api
 *   description: api used to register or add driver
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: driver
 *        description: The driver to create.
 *        schema:
 *         type: object
 *         required:
 *          - driver register
 *         properties:
 *           fullName:
 *             type: string
 *             required:
 *           phone:
 *             type: number
 *             required:
 *           address:
 *             type: string
 *             required:
 *           email:
 *             type: string
 *             required:
 *           licenseNo:
 *             type: string
 *             required:
 *           licenseExp:
 *             type: string
 *             required:
 *           issuedState:
 *             type: string
 *             required:
 *           image:
 *             type: string
 *             required:
 *           carrierId:
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
  fullName: _joi.default.string().trim().required().label("Full Name"),
  // mobile: Joi.object({
  //   code: Joi.string().required().label("Code"),
  //   number: Joi.string().required().label("Mobile No"),
  // }),
  phone: _joi.default.number().label("phone"),
  email: _joi.default.string().trim().label("Email"),
  address: _joi.default.string().trim().label("address"),
  //driverId: Joi.number().required().allow("").label("driver Id"),
  licenseNo: _joi.default.string().trim().required().allow("").label("license No"),
  licenseExp: _joi.default.string().trim().required().allow("").label("license Expire"),
  issuedState: _joi.default.string().trim().required().allow("").label("issued State"),
  image: _joi.default.string().trim().required().label("Driver image"),
  carrierId: _joi.default.string().optional().allow("").label("carrierId")
});
/*
 * api call to function
 */


app.post("/driver/addDriver", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.addDriver);
var _default = app;
exports.default = _default;