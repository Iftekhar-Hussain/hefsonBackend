/*
 * @file: list-drivers.js
 * @description: It Contain list of drivers  router/api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { listDrivers } from "../../../controllers/user";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/driver/list-drivers:
 *  get:
 *   tags: ["Driver"]
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
 *       name: pageNum
 *       required:
 *     - in: query
 *       name: limit
 *       required:
 *     - in: query
 *       name: sortBy
 *       required:
 *     - in: query
 *       name: sortValue
 *       required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userlistSchema = Joi.object({
  search: Joi.string().optional().allow("").label("Search"),
  pageNum: Joi.number().required().label("Page Number"),
  limit: Joi.number().required().label("Limit"),
  sortBy: Joi.string().label("Sort By"),
  sortValue: Joi.number().label("Sort value"),
});

app.get(
  "/driver/list-drivers",
  validator.query(userlistSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  listDrivers
);

export default app;
