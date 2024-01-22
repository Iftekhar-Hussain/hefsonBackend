/*
 * @file: detail.js
 * @description: It Contain detail Soiltable router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { detailSoiltable } from "../../../controllers/soiltable";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/soiltable/detail:
 *  get:
 *   tags: ["Soiltable"]
 *   summary: detail Soiltable api
 *   description: api used to detail Soiltable
 *   parameters:
 *     - in: query
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
  "/soiltable/detail",
  validator.query(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  // checkTokenCommon,
  detailSoiltable
);

export default app;
