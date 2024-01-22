/*
 * @file: edit.js
 * @description: It Contain edit category router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { approveRequestCat } from "../../../controllers/category";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });



/**
 * @swagger
 * /api/v1/category/approveRequestCat:
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
  id: Joi.string().trim().required().label("Request Category Id"),
});

/*
 * api call to function
 */
app.put(
  "/category/approveRequestCat",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  approveRequestCat
);

export default app;
