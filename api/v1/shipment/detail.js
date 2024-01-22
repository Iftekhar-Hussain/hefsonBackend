/*
 * @file: detail.js
 * @description: It Contain detail Shipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { detailShipment } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/detail:
 *  get:
 *   tags: ["Shipment"]
 *   summary: detail Shipment api
 *   description: api used to detail Shipment
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
  id: Joi.string().optional().allow("").label("Search"),
});

app.get(
  "/shipment/detail",
  validator.query(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
 // checkTokenCommon,
  detailShipment
);

export default app;
