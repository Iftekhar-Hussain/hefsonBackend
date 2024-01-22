/*
 * @file: update-driver.js
 * @description: It Contain update driver api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { updateDriver } from "../../../controllers/user";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/driver/update-driver:
 *  put:
 *   tags: ["Driver"]
 *   summary: update driver api
 *   description: api used to update-driver
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: driver
 *        description: The driver to update.
 *        schema:
 *         type: object
 *         required:
 *          - driver update
 *         properties:
 *           fullName:
 *             type: string
 *             required:
 *           _id:
 *             type: string
 *             required:
 *           phone:
 *             type: number
 *             required:
 *           address:
 *             type: string
 *             required:
 *           licenseNo:
 *             type: string
 *             required:
 *           licenseExp:
 *             type: string
 *             required:
 *           issuedState:
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
const Schema = Joi.object({
  _id: Joi.string().allow("").label("_id (user id)"),
  fullName: Joi.string().trim().required().label("Full Name"),
  // mobile: Joi.object({
  //   code: Joi.string().required().label("Code"),
  //   number: Joi.string().required().label("Mobile No"),
  // }),
  phone: Joi.number().label("phone"),
  address: Joi.string().trim().label("address"),
  // driverId: Joi.number().required().allow("").label("driver Id"),
  licenseNo: Joi.string().trim().required().allow("").label("license No"),
  licenseExp: Joi.string().trim().required().allow("").label("license Expire"),
  issuedState: Joi.string().trim().required().allow("").label("issued State"),
  image: Joi.string().required().label("Driver image"),
});

/*
 * api call to function
 */
app.put(
  "/driver/update-driver",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateDriver
);

export default app;
