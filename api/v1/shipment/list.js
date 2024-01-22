/*
 * @file: list.js
 * @description: It Contain list Shipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { listShipment } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/list:
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
 *           pageNum:
 *              type: number
 *           limit:
 *             type: number
 *           sortBy:
 *             type: string
 *           sortValue:
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
  pageNum: Joi.number().required().label("Page Number"),
  limit: Joi.number().required().label("Limit"),
  sortBy: Joi.string().label("Sort By"),
  sortValue: Joi.number().label("Sort value"),
  status: Joi.string().optional().allow("").label("Status - active / complete"),
});

app.post(
  "/shipment/list",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  listShipment
);

export default app;
