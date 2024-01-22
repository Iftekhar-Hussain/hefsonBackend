/*
 * @file: social-login.js
 * @description: It Contain social-login router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { forgotPassword } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/forgotpassword:
 *  post:
 *   tags: ["User"]
 *   summary: forgot password api for all Users
 *   description: api used to forgot password password users
 *   parameters:
 *      - in: body
 *        name: forgot password
 *        description: forgot password
 *        schema:
 *         type: object
 *         required:
 *          - user forgotpassword
 *         properties:
 *           email:
 *             type: string
 *             required:
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
  email: Joi.string()
    .email()
    .required()
    .label("Email")
});

/*
* api call to function
*/
app.post(
  "/user/forgotpassword",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  forgotPassword
);

export default app;
