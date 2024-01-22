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
 * @file: update-driver.js
 * @description: It Contain update driver api.
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/driver/update-driver:
 *  put:
 *   tags: ["Driver"]
 *   summary: update driver api
 *   description: api used to update-driver
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
 *           fullName:
 *             type: string
 *             required:
 *           _id:
 *             type: string
 *             required:
 *           phone:
 *             type: number
 *             required:
 *           address:
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
  _id: _joi.default.string().allow("").label("_id (user id)"),
  fullName: _joi.default.string().trim().required().label("Full Name"),
  // mobile: Joi.object({
  //   code: Joi.string().required().label("Code"),
  //   number: Joi.string().required().label("Mobile No"),
  // }),
  phone: _joi.default.number().label("phone"),
  address: _joi.default.string().trim().label("address"),
  // driverId: Joi.number().required().allow("").label("driver Id"),
  licenseNo: _joi.default.string().trim().required().allow("").label("license No"),
  licenseExp: _joi.default.string().trim().required().allow("").label("license Expire"),
  issuedState: _joi.default.string().trim().required().allow("").label("issued State"),
  image: _joi.default.string().required().label("Driver image")
});
/*
 * api call to function
 */


app.put("/driver/update-driver", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.updateDriver);
var _default = app;
exports.default = _default;