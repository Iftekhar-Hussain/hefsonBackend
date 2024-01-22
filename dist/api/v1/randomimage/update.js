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
 * @file: update.js
 * @description: It Contain update random image router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/randomimage/update:
 *  post:
 *   tags: ["RandomImage"]
 *   summary: update random image api
 *   description: api used to update random image
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: randomimage
 *        description: get random image
 *        schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *           imageLink:
 *             type: string
 *           randomTime:
 *             type: string
 *           category:
 *              type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const randomImageSchema = _joi.default.object({
  id: _joi.default.string().label("id"),
  imageLink: _joi.default.string().label("imageLink"),
  randomTime: _joi.default.string().label("randomTime"),
  category: _joi.default.string().label("category")
});

app.post("/randomimage/update", validator.body(randomImageSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _randomimage.updateImage);
var _default = app;
exports.default = _default;