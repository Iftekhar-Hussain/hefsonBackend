"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _manufacture = require("../../../controllers/manufacture");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: list.js
 * @description: It Contain manufacture list router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/manufacture/list:
 *  get:
 *   tags: ["Manufacture"]
 *   summary: manufacture list api
 *   description: api used to get all manufcature
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
 *     - in: query
 *       name: type
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
  page: _joi.default.number().min(1).required().label("Page number"),
  type: _joi.default.number().optional().allow("").label("Type - 1 for truck, 2 for trailer")
});
/*
 * api call to function
 */


app.get("/manufacture/list", validator.query(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _manufacture.list);
var _default = app;
exports.default = _default;