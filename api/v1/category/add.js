/*
 * @file: add.js
 * @description: It Contain add category router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { add } from "../../../controllers/category";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/category/add:
 *  post:
 *   tags: ["Category"]
 *   summary: add category api
 *   description: api used to add category
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: category
 *        description: The category create api
 *        schema:
 *         type: object
 *         required:
 *          - add category
 *         properties:
 *           name:
 *             type: string
 *             required:
 *           image:
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
  name: Joi.string().trim().required().label("Category Name"),
  image: Joi.string().required().label("Image")
});

/*
 * api call to function
 */
app.post(
  "/category/add",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  add
);

export default app;