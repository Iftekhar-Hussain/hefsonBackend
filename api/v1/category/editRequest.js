/*
 * @file: edit.js
 * @description: It Contain edit category router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { editRequestCat } from "../../../controllers/category";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });



/**
 * @swagger
 * /api/v1/category/editRequestCat:
 *  put:
 *   tags: ["Category"]
 *   summary: update driver api
 *   description: api used to update-driver
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
/*
 * Joi validation on input data
 */
const Schema = Joi.object({
  id: Joi.string().trim().required().label("Category Id"),
  name: Joi.string().trim().required().label("Category Name"),
  image: Joi.string().required().label("Image"),
});

/*
 * api call to function
 */
app.put(
  "/category/editRequestCat",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  editRequestCat
);

export default app;
