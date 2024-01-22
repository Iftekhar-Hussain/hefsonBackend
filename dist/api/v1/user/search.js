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
 * /api/v1/user/globalSearch:
 *  get:
 *   tags: ["User"]
 *   summary: global search api
 *   description: global search api
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: query
 *       name: search
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
  search: _joi.default.string().required().label("Search")
});
/*
 * api call to function
 */


app.get("/user/globalSearch", validator.query(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.globalSearch);
var _default = app;
exports.default = _default;