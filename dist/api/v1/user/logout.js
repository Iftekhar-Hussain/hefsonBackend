"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _user = require("../../../controllers/user");

var _universal = require("../../../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: logout.js
 * @description: It Contain logout router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
/**
 * @swagger
 * /api/v1/user/logout:
 *  delete:
 *   tags: ["User"]
 *   summary: user / business / admin logout api
 *   description: api used to logout user / business / admin
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * api call to function
 */

app.delete("/user/logout", _universal.checkTokenCommon, _user.logout);
var _default = app;
exports.default = _default;