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
 * /api/v1/driver/list-drivers:
 *  get:
 *   tags: ["Driver"]
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
 *       name: pageNum
 *       required:
 *     - in: query
 *       name: limit
 *       required:
 *     - in: query
 *       name: sortBy
 *       required:
 *     - in: query
 *       name: sortValue
 *       required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userlistSchema = _joi.default.object({
  search: _joi.default.string().optional().allow("").label("Search"),
  pageNum: _joi.default.number().required().label("Page Number"),
  limit: _joi.default.number().required().label("Limit"),
  sortBy: _joi.default.string().label("Sort By"),
  sortValue: _joi.default.number().label("Sort value")
});

app.get("/driver/list-drivers", validator.query(userlistSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.listDrivers);
var _default = app;
exports.default = _default;