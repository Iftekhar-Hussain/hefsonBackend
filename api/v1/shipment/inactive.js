/*
 * @file: inactive.js
 * @description: It Contain inactive list of Shipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { listActiveShipment } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/inactive:
 *  post:
 *   tags: ["Shipment"]
 *   summary: list inactive Shipment api
 *   description: api used to list inactive Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *      - in: body
 *        name: user
 *        description: get shipment list inactive
 *        schema:
 *         type: object
 *         properties:
 *           search:
 *             type: string
 *           pageNum:
 *              type: number
 *           limit:
 *             type: number
 *           sortBy:
 *             type: string
 *           sortValue:
 *             type: number
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  search: Joi.string().optional().allow("").label("Search"),
  pageNum: Joi.number().required().label("Page Number"),
  limit: Joi.number().required().label("Limit"),
  sortBy: Joi.string().label("Sort By"),
  sortValue: Joi.number().label("Sort value"),
});

app.post(
  "/shipment/inactive",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  listActiveShipment
);

export default app;
