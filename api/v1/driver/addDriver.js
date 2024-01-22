/*
 * @file: register.js
 * @description: It Contain register or add Driver api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { addDriver } from "../../../controllers/user";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";

/**
 * @swagger
 * /api/v1/driver/addDriver:
 *  post:
 *   tags: ["Driver"]
 *   summary: register or add driver api
 *   description: api used to register or add driver
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: driver
 *        description: The driver to create.
 *        schema:
 *         type: object
 *         required:
 *          - driver register
 *         properties:
 *           fullName:
 *             type: string
 *             required:
 *           phone:
 *             type: number
 *             required:
 *           address:
 *             type: string
 *             required:
 *           email:
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
 *           carrierId:
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
  fullName: Joi.string().trim().required().label("Full Name"),
  // mobile: Joi.object({
  //   code: Joi.string().required().label("Code"),
  //   number: Joi.string().required().label("Mobile No"),
  // }),
  phone: Joi.number().label("phone"),
  email: Joi.string().trim().label("Email"),
  address: Joi.string().trim().label("address"),
  //driverId: Joi.number().required().allow("").label("driver Id"),
  licenseNo: Joi.string().trim().required().allow("").label("license No"),
  licenseExp: Joi.string().trim().required().allow("").label("license Expire"),
  issuedState: Joi.string().trim().required().allow("").label("issued State"),
  image: Joi.string().trim().required().label("Driver image"),
  carrierId: Joi.string().optional().allow("").label("carrierId"),
});

/*
 * api call to function
 */
app.post(
  "/driver/addDriver",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  addDriver
);

export default app;
