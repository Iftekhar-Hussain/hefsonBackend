/*
 * @file: addShipment.js
 * @description: It Contain addShipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { checkTokenCommon } from "../../../utilities/universal";
import { createGroup } from "../../../controllers/chat";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/chat/createGroup:
 *  post:
 *   tags: ["Chat"]
 *   summary: add Shipment api
 *   description: api used to add Shipment
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
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
 *           name:
 *             type: string
 *             required:
 *           users:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 userId:
 *                    type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  name: Joi.string().label("Group Name"),
  users: Joi.array().items(
    Joi.object({
      userId: Joi.string().label("userIds"),
    })
  ),
});

app.post(
  "/chat/createGroup",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  createGroup
);

export default app;
