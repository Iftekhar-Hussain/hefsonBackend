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
 * @file: edit.js
 * @description: It Contain edit trailer router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/trailer/updateStatus:
 *  put:
 *   tags: ["Trailer"]
 *   summary: update status trailer api
 *   description: api used to update trailer status
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer update status api
 *        schema:
 *         type: object
 *         required:
 *          - update trailer status
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           isActive:
 *             type: boolean
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
  id: _joi.default.string().trim().required().label("Trailer Id"),
  isActive: _joi.default.boolean().label("Status")
});
/*
 * api call to function
 */


app.put("/trailer/updateStatus", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _trailer.updateStatus);
var _default = app;
exports.default = _default;