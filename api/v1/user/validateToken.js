/*
 * @file: signinUser.js
 * @description: It Contain login router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { validateToken } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/validateToken:
 *  put:
 *   tags: ["User"]
 *   summary: Email verification api
 *   description: api used to verify email
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           token:
 *             type: string
 *             required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
* Joi validation on input data
*/
const userSchema = Joi.object({
  token: Joi.string()
    .trim()
    .required()
    .label("Token")
});

/*
* api call to function
*/
app.put(
  "/user/validateToken",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  validateToken
);

export default app;
