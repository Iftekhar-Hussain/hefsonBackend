/*
 * @file: edit.js
 * @description: It Contain edit trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { resetHour } from "../../../controllers/trailer";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/trailer/resetHour:
 *  put:
 *   tags: ["Trailer"]
 *   summary: reset hour trailer api
 *   description: api used to reset current hours trailer
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer update status api
 *        schema:
 *         type: object
 *         required:
 *          - update trailer status
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           engineHours:
 *             type: number
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
  id: Joi.string().trim().required().label("Trailer Id"),
  engineHours: Joi.number().label("Total Engine Hours"),
});

/*
 * api call to function
 */
app.put(
  "/trailer/resetHour",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  resetHour
);

export default app;
