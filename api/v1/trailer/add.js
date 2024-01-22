/*
 * @file: add.js
 * @description: It Contain add trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { add } from "../../../controllers/trailer";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/trailer/add:
 *  post:
 *   tags: ["Trailer"]
 *   summary: add trailer api
 *   description: api used to add trailer
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer create api
 *        schema:
 *         type: object
 *         required:
 *          - add trailer
 *         properties:
 *           unitNumber:
 *             type: string
 *             required:
 *           modelYear:
 *             type: string
 *             required:
 *           numberPlate:
 *             type: string
 *             required:
 *           state:
 *             type: string
 *             required:
 *           manufacturer:
 *             type: string
 *             required:
 *           sensorId:
 *             type: string
 *             required:
 *           engineHours:
 *             type: number
 *             required:
 *           registrationExpiry:
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
  unitNumber: Joi.string().trim().required().label("Unit Number"),
  modelYear: Joi.string().required().label("Model Year"),
  numberPlate: Joi.string().trim().required().label("Number Plate"),
  state: Joi.string().trim().required().label("State"),
  manufacturer: Joi.string().trim().required().label("Manufacturer"),
  sensorId: Joi.string().trim().required().label("Sensor Id"),
  engineHours: Joi.number().required().label("Engine Hours"),
  registrationExpiry: Joi.string()
    .required()
    .label("Registation Expiry Date"),
});

/*
 * api call to function
 */
app.post(
  "/trailer/add",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  add
);

export default app;
