/*
 * @file: delete.js
 * @description: It Contain category router/api.
 * @author: Aditi Goel
 */

/*
 * @file: detail.js
 * @description: It Contain detail Soiltable router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { detail } from "../../../controllers/category";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";

/**
 * @swagger
 * /api/v1/category/detail/{id}:
 *  get:
 *   tags: ["Category"]
 *   summary: detail Soiltable api
 *   description: api used to detail Soiltable
 *   parameters:
 *     - in: header
 *       name: authorization
 *       required: true
 *     - in: path
 *       name: id
 *       required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  id: Joi.string().optional().allow("").label("soiltable Id"),
});

app.get(
  "/category/detail/:id",
  validator.params(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  detail
);

export default app;
