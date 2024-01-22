/*
 * @file: delete.js
 * @description: It Contain delete Shipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { deleteShipment } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/delete:
 *  post:
 *   tags: ["Shipment"]
 *   summary: delete Shipment api
 *   description: api used to delete Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: shipment delete
 *        schema:
 *         type: object
 *         properties:
 *           shipmentId:
 *             type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  shipmentId: Joi.string().optional().allow("").label("shipmentId"),
});

app.post(
  "/shipment/delete",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  deleteShipment
);

export default app;
