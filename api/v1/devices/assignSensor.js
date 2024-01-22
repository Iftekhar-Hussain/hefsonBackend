/*
 * @file: edit.js
 * @description: It Contain edit category router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { assignSensor } from "../../../controllers/device";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/device/assignSensor:
 *  put:
 *   tags: ["Device"]
 *   summary: assign sensor api
 *   description: api used to assign sensor
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: category
 *        description: The category edit api
 *        schema:
 *         type: object
 *         required:
 *          - edit category
 *         properties:
 *           sensorId:
 *             type: string
 *             required:
 *           userId:
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
  sensorId: Joi.string().trim().required().label("Sensor Id"),
  userId: Joi.string().required().label("User Id"),
});

/*
 * api call to function
 */
app.put(
  "/device/assignSensor",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  assignSensor
);

export default app;
