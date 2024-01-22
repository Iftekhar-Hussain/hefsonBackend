/*
 * @file: edit.js
 * @description: It Contain edit category router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { approveProduct } from "../../../controllers/soiltable";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/soiltable/approveProduct:
 *  put:
 *   tags: ["Soiltable"]
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
 *           status:
 *             type: boolean
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
  id: Joi.string().trim().required().label("Soiltable Id"),
  status: Joi.boolean().label("Soiltable Status"),
});

/*
 * api call to function
 */
app.put(
  "/soiltable/approveProduct",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  approveProduct
);

export default app;
