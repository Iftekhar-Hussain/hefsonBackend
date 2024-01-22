/*
 * @file: active.js
 * @description: It Contain active list of Shipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { updateStatus } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/updateStatus:
 *  post:
 *   tags: ["Shipment"]
 *   summary: list active Shipment api
 *   description: api used to list active Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: get shipment list active
 *        schema:
 *         type: object
 *         properties:
 *           id:
 *             type: string
 *           status:
 *              type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  id: Joi.string().required().label("Shipment Id"),
  status: Joi.string().required().label("complete / cancel")
});

app.post(
  "/shipment/updateStatus",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  updateStatus
);

export default app;
