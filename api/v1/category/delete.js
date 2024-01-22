/*
 * @file: delete.js
 * @description: It Contain category router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { deleteCategory } from "../../../controllers/category";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/category/delete/{id}:
 *  delete:
 *   tags: ["Category"]
 *   summary: delete category
 *   description: Api used to remove category
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: The category ID
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
  id: Joi.string().required().label("Id"),
});

/*
 * api call to function
 */
app.delete(
  "/category/delete/:id",
  validator.params(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  deleteCategory
);

export default app;
