/*
 * @file: detail-driver.js
 * @description: It Contain detail of driver router/api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { detailDriver } from "../../../controllers/user";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/driver/detail-driver/{id}:
 *  get:
 *   tags: ["Driver"]
 *   summary: driver detail api
 *   description: api used to get detail of drivers
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: path
 *       name: id
 *       required: true
 *       schema:
 *        type: string
 *        description: get driver detail
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userlistSchema = Joi.object({
  id: Joi.string().required().label("id"),
});

app.get(
  "/driver/detail-driver/:id",
  validator.params(userlistSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  detailDriver
);

export default app;
