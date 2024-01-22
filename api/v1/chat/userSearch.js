/*
 * @file: getAllTrailer.js
 * @description: It Contain trailer list router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { getAllUsers } from "../../../controllers/chat";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/chat/getAllUsers:
 *  get:
 *   tags: ["Chat"]
 *   summary: get-all-users list api
 *   description: api used to get all users
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
 *     - in: query
 *       name: role
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
  role: Joi.number().optional().label("User Role"),
});

/*
 * api call to function
 */
app.get(
  "/chat/getAllUsers",
  validator.query(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  getAllUsers
);

export default app;
