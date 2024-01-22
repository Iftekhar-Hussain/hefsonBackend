"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _category = require("../../../controllers/category");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: add.js
 * @description: It Contain add category router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/category/add:
 *  post:
 *   tags: ["Category"]
 *   summary: add category api
 *   description: api used to add category
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: category
 *        description: The category create api
 *        schema:
 *         type: object
 *         required:
 *          - add category
 *         properties:
 *           name:
 *             type: string
 *             required:
 *           image:
 *             type: string
 *             required:
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
  name: _joi.default.string().trim().required().label("Category Name"),
  image: _joi.default.string().required().label("Image")
});
/*
 * api call to function
 */


app.post("/category/add", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _category.add);
var _default = app;
exports.default = _default;