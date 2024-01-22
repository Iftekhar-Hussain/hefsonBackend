/*
 * @file: signinUser.js
 * @description: It Contain login router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { resetPassword } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/user/reset-password:
 *  put:
 *   tags: ["User"]
 *   summary: after getting token(email) reset password api
 *   description: api used to reset password with token
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
 *             required: 
 *           password:
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
    token: Joi.string()
        .required()
        .label("token"),
    password: Joi.string()
        .required()
        .label("Password")
});

/*
* api call to function
*/
app.put(
    "/user/reset-password",
    validator.body(userSchema, {
        joi: { convert: true, allowUnknown: false }
    }),
    resetPassword
);

export default app;
