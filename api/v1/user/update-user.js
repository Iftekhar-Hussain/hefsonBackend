/*
 * @file: update-profile.js
 * @description: It Contain update profile router/api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { updateUser } from "../../../controllers/user";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";

/**
 * @swagger
 * /api/v1/user/update-user:
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
 *           id:
 *             type: string
 *             required:
 *           fullName:
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
const profileSchema = Joi.object({
  id: Joi.string().required().label("User Id"),
  fullName: Joi.string().required().label("fullname"),
  businessName: Joi.string().required().label("Business Name"),
  dotNumber: Joi.string().optional().label("email"),
});

/*
 * api call to function
 */
app.patch(
  "/user/update-user",
  validator.body(profileSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateUser
);

export default app;
