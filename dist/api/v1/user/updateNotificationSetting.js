"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _universal = require("../../../utilities/universal");

var _user = require("../../../controllers/user");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: updateNotificationSetting.js
 * @description: It Contain user update Notification Setting image router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/user/updateNotificationSetting:
 *  post:
 *   tags: ["Notification Setting"]
 *   summary: notificationsetting api
 *   description: api used to notificationsetting
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: notifictionsetting
 *        description: The notifictionsetting to update.
 *        schema:
 *         type: object
 *         required:
 *          - notifictionsetting update
 *         properties:
 *           allowNotification:
 *             type: boolean
 *             required:
 *           alertNotification:
 *             type: boolean
 *             required:
 *           chatNotification:
 *             type: boolean
 *             required:
 *           temperatureAlert:
 *             type: boolean
 *             required:
 *
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const notificationSettingSchema = _joi.default.object({
  allowNotification: _joi.default.boolean().label("allowNotification"),
  alertNotification: _joi.default.boolean().label("alertNotification"),
  chatNotification: _joi.default.boolean().label("chatNotification"),
  temperatureAlert: _joi.default.boolean().label("temperatureAlert")
});

app.post("/user/updateNotificationSetting", validator.body(notificationSettingSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _user.updateNotificationSetting);
var _default = app;
exports.default = _default;