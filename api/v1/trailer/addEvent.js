/*
 * @file: add.js
 * @description: It Contain add trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { addEvent } from "../../../controllers/trailer";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/trailer/addEvent:
 *  post:
 *   tags: ["Trailer"]
 *   summary: add event trailer api
 *   description: api used to add trailer event
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
 *          - add trailer event
 *         properties:
 *           trailerId:
 *             type: string
 *             required:
 *           status:
 *             type: string
 *             required:
 *           comment:
 *             type: string
 *             required:
 *           amount:
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
  trailerId: Joi.string().trim().required().label("TailerId"),
  status: Joi.string().trim().required().label("Status"),
  comment: Joi.string().required().label("Comment"),
  amount: Joi.number().required().label("Amount"),
});

/*
 * api call to function
 */
app.post(
  "/trailer/addEvent",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  addEvent
);

export default app;
