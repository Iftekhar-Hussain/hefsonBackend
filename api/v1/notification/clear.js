/*
 * @file: edit.js
 * @description: It Contain edit trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { clearNotification } from "../../../controllers/notification";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/notification/clearNotification:
 *  put:
 *   tags: ["Notification"]
 *   summary: update status trailer api
 *   description: api used to update trailer status
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
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
 * api call to function
 */
app.put(
  "/notification/clearNotification",
  checkTokenCommon,
  clearNotification
);

export default app;
