/*
 * @file: update.js
 * @description: It Contain update random image router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { updateImage } from "../../../controllers/randomimage";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/randomimage/update:
 *  post:
 *   tags: ["RandomImage"]
 *   summary: update random image api
 *   description: api used to update random image
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
 *           id:
 *             type: string
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
  id: Joi.string().label("id"),
  imageLink: Joi.string().label("imageLink"),
  randomTime: Joi.string().label("randomTime"),
  category: Joi.string().label("category"),
});

app.post(
  "/randomimage/update",
  validator.body(randomImageSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateImage
);

export default app;
