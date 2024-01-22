/*
 * @file: get-profile.js
 * @description: It Contain register User  router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { getById } from "../../../controllers/user";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/getDetail/{id}:
 *  get:
 *   tags: ["User"]
 *   summary: get-profile detail list api
 *   description: api used to get profile detail
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: The user detail ID
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
  "/user/getDetail/:id",
  checkTokenCommon,
  getById
);

export default app;
