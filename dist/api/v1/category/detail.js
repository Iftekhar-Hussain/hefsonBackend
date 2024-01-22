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
 * @file: delete.js
 * @description: It Contain category router/api.
 * @author: Aditi Goel
 */

/*
 * @file: detail.js
 * @description: It Contain detail Soiltable router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});

/**
 * @swagger
 * /api/v1/category/detail/{id}:
 *  get:
 *   tags: ["Category"]
 *   summary: detail Soiltable api
 *   description: api used to detail Soiltable
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: path
 *       name: id
 *       required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */
const shipmentSchema = _joi.default.object({
  id: _joi.default.string().optional().allow("").label("soiltable Id")
});

app.get("/category/detail/:id", validator.params(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _category.detail);
var _default = app;
exports.default = _default;