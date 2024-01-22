/*
 * @file: list.js
 * @description: It Contain list Shipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { listAlarm } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/listAlarm:
 *  post:
 *   tags: ["Shipment"]
 *   summary: list Shipment api
 *   description: api used to list Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: get shipment list
 *        schema:
 *         type: object
 *         properties:
 *           search:
 *             type: string
 *           page:
 *              type: number
 *           limit:
 *             type: number
 *           status:
 *             type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  search: Joi.string().optional().allow("").label("Search"),
  page: Joi.number().required().label("Page Number"),
  limit: Joi.number().required().label("Limit"),
  status: Joi.string().optional().allow("").label("Status - current / past"),
});

app.post(
  "/shipment/listAlarm",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  listAlarm
);

export default app;
