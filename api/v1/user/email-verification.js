/*
 * @file: signinUser.js
 * @description: It Contain login router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { emailVerify } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/email-verification:
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
 *           otp:
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
  otp: Joi.string()
    .trim()
    .required()
    .label("Code")
});

/*
* api call to function
*/
app.put(
  "/user/email-verification",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  emailVerify
);

export default app;
