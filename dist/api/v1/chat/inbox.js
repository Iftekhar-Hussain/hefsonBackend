"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _chat = require("../../../controllers/chat");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: getAllTrailer.js
 * @description: It Contain trailer list router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/chat/getInbox:
 *  get:
 *   tags: ["Chat"]
 *   summary: get-all-trailer list api
 *   description: api used to get all trailers
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: query
 *       name: limit
 *       required: true
 *     - in: query
 *       name: search
 *       required:
 *     - in: query
 *       name: page
 *       required:
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
  limit: _joi.default.number().min(1).required().label("limit"),
  search: _joi.default.string().optional().allow("").label("Search"),
  page: _joi.default.number().min(1).required().label("Page number")
});
/*
 * api call to function
 */


app.get("/chat/getInbox", validator.query(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _chat.getInbox);
var _default = app;
exports.default = _default;