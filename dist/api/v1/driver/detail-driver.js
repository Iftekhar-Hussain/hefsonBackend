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
 * @file: detail-driver.js
 * @description: It Contain detail of driver router/api.
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/driver/detail-driver/{id}:
 *  get:
 *   tags: ["Driver"]
 *   summary: driver detail api
 *   description: api used to get detail of drivers
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: string
 *        description: get driver detail
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userlistSchema = _joi.default.object({
  id: _joi.default.string().required().label("id")
});

app.get("/driver/detail-driver/:id", validator.params(userlistSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.detailDriver);
var _default = app;
exports.default = _default;