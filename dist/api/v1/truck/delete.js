"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _truck = require("../../../controllers/truck");

var _universal = require("../../../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: delete.js
 * @description: It Contain truck router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});

// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/truck/delete/{id}:
 *  delete:
 *   tags: ["Truck"]
 *   summary: delete truck
 *   description: Api used to remove truck
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: The truck ID      
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
  id: _joi.default.string().required().label("Id")
});
/*
* api call to function
*/


app.delete("/truck/delete/:id", validator.params(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _truck.deleteTruck);
var _default = app;
exports.default = _default;