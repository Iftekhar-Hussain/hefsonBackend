"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _user = require("../../../controllers/user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: social-login.js
 * @description: It Contain social-login router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/user/forgotpassword:
 *  post:
 *   tags: ["User"]
 *   summary: forgot password api for all Users
 *   description: api used to forgot password password users
 *   parameters:
 *      - in: body
 *        name: forgot password
 *        description: forgot password
 *        schema:
 *         type: object
 *         required:
 *          - user forgotpassword
 *         properties:
 *           email:
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

const userSchema = _joi.default.object({
  email: _joi.default.string().email().required().label("Email")
});
/*
* api call to function
*/


app.post("/user/forgotpassword", validator.body(userSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _user.forgotPassword);
var _default = app;
exports.default = _default;