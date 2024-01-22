/*
 * @file: edit.js
 * @description: It Contain edit truck router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { edit } from "../../../controllers/truck";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/truck/edit:
 *  put:
 *   tags: ["Truck"]
 *   summary: edit truck api
 *   description: api used to edit truck
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: truck
 *        description: The truck edit api
 *        schema:
 *         type: object
 *         required:
 *          - edit truck
 *         properties:
 *           id:
 *             type: string
 *             required:
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
 *           manufacture:
 *             type: string
 *             required:
 *           truckColor:
 *             type: string
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
  id: Joi.string().trim().required().label("Truck Id"),
  unitNumber: Joi.string().trim().required().label("Unit Number"),
  modelYear: Joi.string().required().label("Model Year"),
  numberPlate: Joi.string().trim().required().label("Number Plate"),
  state: Joi.string().trim().required().label("State"),
  manufacture: Joi.string().trim().required().label("Manufacturer"),
  truckColor: Joi.string().trim().required().label("Truck Color"),
  registrationExpiry: Joi.string()
    .required()
    .label("Registation Expiry Date")
});

/*
 * api call to function
 */
app.put(
  "/truck/edit",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  edit
);

export default app;