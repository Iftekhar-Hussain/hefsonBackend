"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _soiltable = require("../../../controllers/soiltable");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: add.js
 * @description: It Contain add soiltable router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/soiltable/addTimeline:
 *  post:
 *   tags: ["Soiltable"]
 *   summary: add soiltable timeline api
 *   description: api used to add soiltable
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: soiltable
 *        description: The soiltable timeline create api
 *        schema:
 *         type: object
 *         required:
 *          - add soiltable timeline
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           processingDate:
 *             type: string
 *             required:
 *           processingTime:
 *             type: string
 *             required:
 *           status:
 *             type: string
 *             required:
 *           location:
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
  id: _joi.default.string().trim().required().label("Product Id"),
  processingDate: _joi.default.string().label("Processing Date"),
  processingTime: _joi.default.string().label("Processing Time"),
  status: _joi.default.string().label("Status"),
  location: _joi.default.string().label("Location")
});
/*
 * api call to function
 */


app.post("/soiltable/addTimeline", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _soiltable.addTimeline);
var _default = app;
exports.default = _default;