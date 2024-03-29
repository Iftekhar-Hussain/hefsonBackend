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
 * @file: edit.js
 * @description: It Contain edit category router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/soiltable/approveProduct:
 *  put:
 *   tags: ["Soiltable"]
 *   summary: update driver api
 *   description: api used to update-driver
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: driver
 *        description: The driver to update.
 *        schema:
 *         type: object
 *         required:
 *          - driver update
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           status:
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

/*
 * Joi validation on input data
 */

const Schema = _joi.default.object({
  id: _joi.default.string().trim().required().label("Soiltable Id"),
  status: _joi.default.boolean().label("Soiltable Status")
});
/*
 * api call to function
 */


app.put("/soiltable/approveProduct", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _soiltable.approveProduct);
var _default = app;
exports.default = _default;