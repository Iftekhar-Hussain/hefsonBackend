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
 * @file: signinUser.js
 * @description: It Contain login router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
}); // https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *   tags: ["User"]
 *   summary: user/ admin / business login api
 *   description: api used to login user / admin /business
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required: true
 *           deviceId:
 *             type: string
 *             required:
 *           deviceType:
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
  email: _joi.default.string().email().allow('').label("Email"),
  password: _joi.default.string().trim().required().label("Password"),
  deviceId: _joi.default.string().trim().allow('').label("Device Token"),
  deviceType: _joi.default.string().trim().allow('').label("Device type")
});
/*
* api call to function
*/


app.post("/user/login", validator.body(userSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _user.login);
var _default = app;
exports.default = _default;