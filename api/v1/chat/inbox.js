/*
 * @file: getAllTrailer.js
 * @description: It Contain trailer list router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { getInbox } from "../../../controllers/chat";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/chat/getInbox:
 *  get:
 *   tags: ["Chat"]
 *   summary: get-all-trailer list api
 *   description: api used to get all trailers
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: query
 *       name: limit
 *       required: true
 *     - in: query
 *       name: search
 *       required:
 *     - in: query
 *       name: page
 *       required:
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
  limit: Joi.number().min(1).required().label("limit"),
  search: Joi.string().optional().allow("").label("Search"),
  page: Joi.number().min(1).required().label("Page number"),
});

/*
 * api call to function
 */
app.get(
  "/chat/getInbox",
  validator.query(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  getInbox
);

export default app;
