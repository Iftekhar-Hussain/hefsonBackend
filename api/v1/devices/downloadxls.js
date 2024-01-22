/*
 * @file: add.js
 * @description: It Contain add trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { downloadXls } from "../../../controllers/device";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/device/downloadXls:
 *  post:
 *   tags: ["Device"]
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
 *           id:
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
  id: Joi.string().trim().required().label("Device Id")
});

/*
 * api call to function
 */
app.post(
  "/device/downloadXls",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  downloadXls
);

export default app;
