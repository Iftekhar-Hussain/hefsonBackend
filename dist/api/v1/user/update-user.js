"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _user = require("../../../controllers/user");

var _universal = require("../../../utilities/universal");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: update-profile.js
 * @description: It Contain update profile router/api.
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});

/**
 * @swagger
 * /api/v1/user/update-user:
 *  patch:
 *   tags: ["User"]
 *   summary: update user profile api
 *   description: Api to used Update user profile
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: body
 *        name: user
 *        description: Api to used Update the status of dealer
 *        schema:
 *         type: object
 *         required:
 *          - Admin login
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           fullName:
 *             type: string
 *             required:
 *           businessName:
 *             type: string
 *             required:
 *           dotNumber:
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
const profileSchema = _joi.default.object({
  id: _joi.default.string().required().label("User Id"),
  fullName: _joi.default.string().required().label("fullname"),
  businessName: _joi.default.string().required().label("Business Name"),
  dotNumber: _joi.default.string().optional().label("email")
});
/*
 * api call to function
 */


app.patch("/user/update-user", validator.body(profileSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.updateUser);
var _default = app;
exports.default = _default;