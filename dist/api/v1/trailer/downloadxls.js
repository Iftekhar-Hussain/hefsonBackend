"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _trailer = require("../../../controllers/trailer");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: add.js
 * @description: It Contain add trailer router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/trailer/downloadXls:
 *  post:
 *   tags: ["Trailer"]
 *   summary: add trailer api
 *   description: api used to add trailer
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer create api
 *        schema:
 *         type: object
 *         required:
 *          - add trailer
 *         properties:
 *           id:
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
  id: _joi.default.string().trim().required().label("Trailer Id")
});
/*
 * api call to function
 */


app.post("/trailer/downloadXls", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _trailer.downloadXls);
var _default = app;
exports.default = _default;