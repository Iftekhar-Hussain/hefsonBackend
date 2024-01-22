/*
 * @file: addShipment.js
 * @description: It Contain addShipment router
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";

import { checkTokenCommon } from "../../../utilities/universal";
import { addShipment } from "../../../controllers/shipment";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/addShipment:
 *  post:
 *   tags: ["Shipment"]
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
 *           truckId:
 *             type: string
 *             required:
 *           trailerId:
 *             type: string
 *             required:
 *           isDefaultTruck:
 *             type: boolean
 *             required:
 *           isDefaultTrailer:
 *             type: boolean
 *             required:
 *           driverId:
 *             type: string
 *             required:
 *           isDefaultDriver:
 *             type: boolean
 *             required:
 *           shipper:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                    type: number
 *                 pickupName:
 *                    type: string
 *                 pickupAddress:
 *                    type: string
 *                 latitude:
 *                    type: number
 *                 longitude:
 *                    type: number
 *                 pickupDate:
 *                    type: string
 *                 pickupTime:
 *                    type: string
 *                 poNumber:
 *                    type: string
 *           receiver:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 id:
 *                    type: number
 *                 deliveryName:
 *                    type: string
 *                 deliveryAddress:
 *                    type: string
 *                 latitude:
 *                    type: number
 *                 longitude:
 *                    type: number
 *                 deliveryDate:
 *                    type: string
 *                 deliveryTime:
 *                    type: string
 *                 deliveryNumber:
 *                    type: string
 *           temperature:
 *               type: object
 *               description: temprature
 *               properties:
 *                 actual:
 *                    type: string
 *                 min:
 *                    type: string
 *                 max:
 *                    type: string
 *           referenceNumber:
 *             type: string
 *             required:
 *           comment:
 *             type: string
 *             required:
 *           broker:
 *               type: object
 *               description: broker information
 *               properties:
 *                 name:
 *                    type: string
 *                 brokerAgent:
 *                    type: string
 *                 brokerPhone:
 *                    type: string
 *                 brokerhefsonId:
 *                     type: string
 *           dispatchName:
 *             type: string
 *             required:
 *           carrierPhone:
 *             type: number
 *             required:
 *           carrierEmergencyPhone:
 *             type: number
 *             required:
 *
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

const shipmentSchema = Joi.object({
  truckId: Joi.string().label("Truck Id"),
  trailerId: Joi.string().label("Trailer Id"),
  isDefaultTruck: Joi.boolean().label("Is default truck"),
  isDefaultTrailer: Joi.boolean().label("Is default trailer"),
  driverId: Joi.string().label("Driver Id"),
  isDefaultDriver: Joi.boolean().label("Is default driver"),
  shipper: Joi.array().items(
    Joi.object({
      id: Joi.number().label("Id"),
      pickupName: Joi.string().label("pickupName"),
      pickupAddress: Joi.string().label("pickupAddress"),
      latitude: Joi.number().label("Latitude"),
      longitude: Joi.number().label("Longitude"),
      pickupDate: Joi.string().label("pickupDate"),
      pickupTime: Joi.string().label("pickupTime"),
      poNumber: Joi.string().label("poNumber"),
    })
  ),
  receiver: Joi.array().items(
    Joi.object({
      id: Joi.number().label("Id"),
      deliveryName: Joi.string().label("deliveryName"),
      deliveryAddress: Joi.string().label("deliveryAddress"),
      latitude: Joi.number().label("Latitude"),
      longitude: Joi.number().label("Longitude"),
      deliveryDate: Joi.string().label("deliveryDate"),
      deliveryTime: Joi.string().label("deliveryTime"),
      deliveryNumber: Joi.string().label("deliveryNumber"),
    })
  ),
  temperature: Joi.object({
    actual: Joi.string().required().label("actual"),
    min: Joi.string().required().label("min"),
    max: Joi.string().required().label("max"),
  }),
  referenceNumber: Joi.string().label("referenceNumber"),
  comment: Joi.string().label("comment"),
  broker:  Joi.object({
      name: Joi.string().label("Broker Name"),
      brokerAgent: Joi.string().label("Broker Agent"),
      brokerPhone: Joi.number().label("Broker Phone"),
      brokerhefsonId: Joi.string().label("Broker Hefson Id"),
    }),
  dispatchName: Joi.string().label("dispatchName"),
  carrierPhone: Joi.number().label("carrierPhone"),
  carrierEmergencyPhone: Joi.number().label("carrierEmergencyPhone"),
});

app.post(
  "/shipment/addShipment",
  validator.body(shipmentSchema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  addShipment
);

export default app;
