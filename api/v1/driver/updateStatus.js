/*
 * @file: update-driver.js
 * @description: It Contain update driver api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { updateStatus } from "../../../controllers/user";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/driver/updateStatus:
 *  put:
 *   tags: ["Driver"]
 *   summary: update driver status api
 *   description: api used to update-driver status
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
  id: Joi.string().allow("").label("id (user id)"),
  isActive: Joi.boolean().label("Status")
});

/*
 * api call to function
 */
app.put(
  "/driver/updateStatus",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateStatus
);

export default app;
