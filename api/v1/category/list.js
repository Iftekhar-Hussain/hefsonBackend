/*
 * @file: list-drivers.js
 * @description: It Contain list of drivers  router/api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { list } from "../../../controllers/category";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/category/list:
 *  get:
 *   tags: ["Category"]
 *   summary: drivers list api
 *   description: api used to get list of drivers
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: query
 *       name: search
 *       required:
 *     - in: query
 *       name: page
 *       required:
 *     - in: query
 *       name: limit
 *       required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userlistSchema = Joi.object({
  search: Joi.string().optional().allow("").label("Search"),
  page: Joi.number().required().label("Page Number"),
  limit: Joi.number().required().label("Limit")
});

app.get(
  "/category/list",
  validator.query(userlistSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  list
);

export default app;
