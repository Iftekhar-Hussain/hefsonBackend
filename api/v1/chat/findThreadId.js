/*
 * @file: getAllTrailer.js
 * @description: It Contain trailer list router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { findThreadId } from "../../../controllers/chat";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/chat/findThreadId:
 *  get:
 *   tags: ["Chat"]
 *   summary: get-all-users list api
 *   description: api used to get all users
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: query
 *       name: userId
 *       required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * Joi validation on input data
 */
const Schema = Joi.object({
  userId: Joi.string().required().label("Search"),
});

/*
 * api call to function
 */
app.get(
  "/chat/findThreadId",
  validator.query(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  findThreadId
);

export default app;
