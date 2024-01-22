/*
 * @file: signinUser.js
 * @description: It Contain login router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { login } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/login:
 *  post:
 *   tags: ["User"]
 *   summary: user/ admin / business login api
 *   description: api used to login user / admin /business
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to login.
 *        schema:
 *         type: object
 *         required:
 *          - user login
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required: true
 *           deviceId:
 *             type: string
 *             required:
 *           deviceType:
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
    .allow('')
    .label("Email"),
  password: Joi.string()
    .trim()
    .required()
    .label("Password"),
  deviceId: Joi.string()
    .trim()
    .allow('')
    .label("Device Token"),
  deviceType: Joi.string()
    .trim()
    .allow('')
    .label("Device type"),
});

/*
* api call to function
*/
app.post(
  "/user/login",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false }
  }),
  login
);

export default app;
