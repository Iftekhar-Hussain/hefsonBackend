/*
 * @file: update-profile.js
 * @description: It Contain update profile router/api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { updateProfile } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";

/**
 * @swagger
 * /api/v1/user/update-profile:
 *  patch:
 *   tags: ["User"]
 *   summary: update user profile api
 *   description: Api to used Update user profile
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: body
 *        name: user
 *        description: Api to used Update the status of dealer
 *        schema:
 *         type: object
 *         required:
 *          - Admin login
 *         properties:
 *           fullName:
 *             type: string
 *             required:
 *           businessName:
 *             type: string
 *             required:
 *           phone:
 *             type: number
 *             required:
 *           emergencyPhone:
 *             type: number
 *             required:
 *           address:
 *             type: string
 *             required:
 *           dotNumber:
 *             type: string
 *             required:
 *           image:
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
const profileSchema = Joi.object({
  fullName: Joi.string().required().label("fullname"),
 // dob: Joi.string().required().label("DOB"),
  businessName: Joi.string().required().label("id"),
 // gender: Joi.string().required().label("gender"),
  phone: Joi.number().required().label("phone"),
  emergencyPhone: Joi.number().required().label("Emergency Phone"),
  address: Joi.string().required().label("Address"),
  dotNumber: Joi.string().optional().label("email"),
  image: Joi.string().optional().label("Image"),
});

/*
 * api call to function
 */
app.patch(
  "/user/update-profile",
  validator.body(profileSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateProfile
);

export default app;
