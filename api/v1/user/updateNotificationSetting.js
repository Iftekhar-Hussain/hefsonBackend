/*
 * @file: updateNotificationSetting.js
 * @description: It Contain user update Notification Setting image router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { updateNotificationSetting } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });

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

const notificationSettingSchema = Joi.object({
  allowNotification: Joi.boolean().label("allowNotification"),
  alertNotification: Joi.boolean().label("alertNotification"),
  chatNotification: Joi.boolean().label("chatNotification"),
  temperatureAlert: Joi.boolean().label("temperatureAlert"),
});

app.post(
  "/user/updateNotificationSetting",
  validator.body(notificationSettingSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateNotificationSetting
);

export default app;
