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
 * /api/v1/user/validateToken:
 *  put:
 *   tags: ["User"]
 *   summary: Email verification api
 *   description: api used to verify email
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           token:
 *             type: string
 *             required: true
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
  token: _joi.default.string().trim().required().label("Token")
});
/*
* api call to function
*/


app.put("/user/validateToken", validator.body(userSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _user.validateToken);
var _default = app;
exports.default = _default;