/*
 * @file: list.js
 * @description: It Contain manufacture list router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { list } from "../../../controllers/manufacture";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/manufacture/list:
 *  get:
 *   tags: ["Manufacture"]
 *   summary: manufacture list api
 *   description: api used to get all manufcature
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
 *       name: type
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
  type: Joi.number().optional().allow("").label("Type - 1 for truck, 2 for trailer")
});

/*
 * api call to function
 */
app.get(
  "/manufacture/list",
  validator.query(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  list
);

export default app;
