/*
 * @file: uploadImage.js
 * @description: It Contain upload user image router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { uploadImage } from "../../../controllers/file";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/file/upload-image:
 *  post:
 *   tags: ["File"]
 *   summary: upload image api
 *   description: api used to upload image
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: formData
 *        name: uploadImage
 *        type: file
 *      - in: formData
 *        name: folderName
 *        type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const userSchema = Joi.object({
  uploadImage: Joi.string().label("Upload image"),
  folderName: Joi.string().label("Module Name"),
});

app.post(
  "/file/upload-image",
  validator.body(userSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  uploadImage
);

export default app;
