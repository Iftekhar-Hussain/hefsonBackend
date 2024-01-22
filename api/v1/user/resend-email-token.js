/*
 * @file: signinUser.js
 * @description: It Contain login router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { resendEmailToken } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/resend-email-token:
 *  put:
 *   tags: ["User"]
 *   summary: Email token resend api
 *   description: api used to resend email token
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           id:
 *             type: string
 *             description: user id
 *             required: 
 *           email:
 *             type: string
 *             description: email
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
  id: Joi.string()
    .allow("")
    .label("User Id"),
    email: Joi.string()
    .allow("")
    .label("Email")
});

/*
* api call to function
*/
app.put(
  "/user/resend-email-token",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  resendEmailToken
);

export default app;
