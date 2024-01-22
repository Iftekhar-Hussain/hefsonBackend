"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _user = require("../../../controllers/user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: get-profile.js
 * @description: It Contain terms and conditions  router/api.
 * @author: Ankit Kumar Gautam
 */
// import Joi from "@hapi/joi";
// import { checkTokenCommon } from "../../../utilities/universal";
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/user/get-terms:
 *  get:
 *   tags: ["User"]
 *   summary: get-profile list api
 *   description: api used to get profile
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * api call to function
 */

app.get("/user/get-terms", _user.getTerms);
var _default = app;
exports.default = _default;