"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _user = require("../../../controllers/user");

var _universal = require("../../../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: get-profile.js
 * @description: It Contain register User  router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/user/get-profile:
 *  get:
 *   tags: ["User"]
 *   summary: get-profile list api
 *   description: api used to get profile
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
* api call to function
*/

app.get("/user/get-profile", _universal.checkTokenCommon, _user.getProfile);
var _default = app;
exports.default = _default;