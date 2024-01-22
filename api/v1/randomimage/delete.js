/*
 * @file: delete.js
 * @description: It Contain delete random image router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { deleteRandomImage } from "../../../controllers/randomimage";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/randomimage/delete:
 *  post:
 *   tags: ["RandomImage"]
 *   summary: delete random image api
 *   description: api used to delete random image
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: random image delete
 *        schema:
 *         type: object
 *         properties:
 *           randomImageId:
 *             type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const randomImageSchema = Joi.object({
  randomImageId: Joi.string().optional().allow("").label("randomImageId"),
});

app.post(
  "/randomimage/delete",
  validator.body(randomImageSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  deleteRandomImage
);

export default app;
