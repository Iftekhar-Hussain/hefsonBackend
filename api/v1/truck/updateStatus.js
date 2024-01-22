/*
 * @file: edit.js
 * @description: It Contain edit truck router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { updateStatus } from "../../../controllers/truck";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/truck/updateStatus:
 *  put:
 *   tags: ["Truck"]
 *   summary: update truck status api
 *   description: api used to update truck status
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: truck
 *        description: The truck update status api
 *        schema:
 *         type: object
 *         required:
 *          - update truck status
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           isActive:
 *             type: boolean
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
  isActive: Joi.boolean().label("Status"),
});

/*
 * api call to function
 */
app.put(
  "/truck/updateStatus",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateStatus
);

export default app;
