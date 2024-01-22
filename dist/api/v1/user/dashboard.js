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
 * @file: list.js
 * @description: It Contain device list router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/user/dashboard:
 *  get:
 *   tags: ["User"]
 *   summary: get dashboard data
 *   description: api used to get dashboard
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

app.get("/user/dashboard", _universal.checkTokenCommon, _user.dashboard);
var _default = app;
exports.default = _default;