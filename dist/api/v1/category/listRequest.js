"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _category = require("../../../controllers/category");

var _universal = require("../../../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: list-drivers.js
 * @description: It Contain list of drivers  router/api.
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/category/listRequest:
 *  get:
 *   tags: ["Category"]
 *   summary: drivers list api
 *   description: api used to get list of drivers
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: query
 *       name: search
 *       required:
 *     - in: query
 *       name: page
 *       required:
 *     - in: query
 *       name: limit
 *       required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userlistSchema = _joi.default.object({
  search: _joi.default.string().optional().allow("").label("Search"),
  page: _joi.default.number().required().label("Page Number"),
  limit: _joi.default.number().required().label("Limit")
});

app.get("/category/listRequest", validator.query(userlistSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _category.listRequest);
var _default = app;
exports.default = _default;