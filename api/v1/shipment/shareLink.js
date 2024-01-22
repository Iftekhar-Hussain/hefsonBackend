/*
 * @file: addShipment.js
 * @description: It Contain addShipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { shareLink } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/shareLink:
 *  post:
 *   tags: ["Shipment"]
 *   summary: add Shipment api
 *   description: api used to add Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: body
 *        name: driver
 *        description: The driver to update.
 *        schema:
 *         type: object
 *         required:
 *          - driver update
 *         properties:
 *           email:
 *             type: string
 *             required:
 *           url:
 *             type: string
 *             required:
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  email: Joi.string().label("Email Id"),
  url: Joi.string().label("Share Url")
});

app.post(
  "/shipment/shareLink",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  shareLink
);

export default app;
