"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _universal = require("../../../utilities/universal");

var _randomimage = require("../../../controllers/randomimage");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: delete.js
 * @description: It Contain delete random image router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/randomimage/delete:
 *  post:
 *   tags: ["RandomImage"]
 *   summary: delete random image api
 *   description: api used to delete random image
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: random image delete
 *        schema:
 *         type: object
 *         properties:
 *           randomImageId:
 *             type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const randomImageSchema = _joi.default.object({
  randomImageId: _joi.default.string().optional().allow("").label("randomImageId")
});

app.post("/randomimage/delete", validator.body(randomImageSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _randomimage.deleteRandomImage);
var _default = app;
exports.default = _default;