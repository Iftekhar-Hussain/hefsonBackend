/*
 * @file: list.js
 * @description: It Contain device list router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { dashboard } from "../../../controllers/user";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/dashboard:
 *  get:
 *   tags: ["User"]
 *   summary: get dashboard data
 *   description: api used to get dashboard
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * api call to function
 */
app.get(
  "/user/dashboard",
  checkTokenCommon,
  dashboard
);

export default app;
