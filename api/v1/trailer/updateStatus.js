/*
 * @file: edit.js
 * @description: It Contain edit trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { updateStatus } from "../../../controllers/trailer";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/trailer/updateStatus:
 *  put:
 *   tags: ["Trailer"]
 *   summary: update status trailer api
 *   description: api used to update trailer status
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
 *           isActive:
 *             type: boolean
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
  isActive: Joi.boolean().label("Status")
});

/*
 * api call to function
 */
app.put(
  "/trailer/updateStatus",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateStatus
);

export default app;
