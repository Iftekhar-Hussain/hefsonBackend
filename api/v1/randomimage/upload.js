/*
 * @file: upload.js
 * @description: It Contain upload random image router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { uploadImage } from "../../../controllers/randomimage";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/randomimage/upload:
 *  post:
 *   tags: ["RandomImage"]
 *   summary: upload random image api
 *   description: api used to upload random image
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: randomimage
 *        description: get random image
 *        schema:
 *         type: object
 *         properties:
 *           imageLink:
 *             type: string
 *           randomTime:
 *             type: string
 *           category:
 *              type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const randomImageSchema = Joi.object({
  imageLink: Joi.string().label("imageLink"),
  randomTime: Joi.string().label("randomTime"),
  category: Joi.string().label("category"),
});

app.post(
  "/randomimage/upload",
  validator.body(randomImageSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  uploadImage
);

export default app;
