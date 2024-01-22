/*
 * @file: delete-driver.js
 * @description: It Contain delete driver api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { deleteDriver } from "../../../controllers/user";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/driver/delete-driver:
 *  delete:
 *   tags: ["Driver"]
 *   summary: delete driver api
 *   description: api used to delete-driver
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: driver
 *        description: The driver to delete.
 *        schema:
 *         type: object
 *         required:
 *          - driver delete
 *         properties:
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
  userId: Joi.string().required().label("userId"),
});

/*
 * api call to function
 */
app.delete(
  "/driver/delete-driver",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  deleteDriver
);

export default app;
