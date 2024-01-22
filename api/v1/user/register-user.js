/*
 * @file: register.js
 * @description: It Contain register User  router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { registerUser } from "../../../controllers/user";
import { checkToken } from "../../../utilities/universal";

import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/register:
 *  post:
 *   tags: ["User"]
 *   summary: register user api
 *   description: api used to register user
 *   parameters:
 *      - in: body
 *        name: user
 *        description: The user to create.
 *        schema:
 *         type: object
 *         required:
 *          - user register
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           password:
 *             type: string
 *             required:
 *           role:
 *             type: number
 *             required:
 *           deviceId:
 *             type: string
 *             required:
 *           deviceType:
 *             type: string
 *             required:
 *           fullName:
 *             type: string
 *             required:
 *           licenseNo:
 *             type: string
 *             required:
 *           businessName:
 *             type: string
 *             required:
 *           dotNumber:
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
const Schema = Joi.object({
  email: Joi.string().email().trim().required().label("Email"),
  password: Joi.string().trim().required().label("Password"),
  role: Joi.number().required().label("Role"),
  deviceId: Joi.string().trim().allow("").label("Device Token"),
  deviceType: Joi.string().trim().allow("").label("Device type"),
  fullName: Joi.string().trim().required().label("Full Name"),
  licenseNo: Joi.string().trim().allow("").label("License No"),
  businessName: Joi.string().trim().label("Business Name"),
  dotNumber: Joi.string().trim().label("DOT Number")
});

/*
 * api call to function
 */
app.post(
  "/user/register",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  registerUser
);

export default app;
