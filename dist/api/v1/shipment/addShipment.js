"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

var _universal = require("../../../utilities/universal");

var _shipment = require("../../../controllers/shipment");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: addShipment.js
 * @description: It Contain addShipment router
 * @author: Ankit Kumar Gautam
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
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

const shipmentSchema = _joi.default.object({
  truckId: _joi.default.string().label("Truck Id"),
  trailerId: _joi.default.string().label("Trailer Id"),
  isDefaultTruck: _joi.default.boolean().label("Is default truck"),
  isDefaultTrailer: _joi.default.boolean().label("Is default trailer"),
  driverId: _joi.default.string().label("Driver Id"),
  isDefaultDriver: _joi.default.boolean().label("Is default driver"),
  shipper: _joi.default.array().items(_joi.default.object({
    id: _joi.default.number().label("Id"),
    pickupName: _joi.default.string().label("pickupName"),
    pickupAddress: _joi.default.string().label("pickupAddress"),
    latitude: _joi.default.number().label("Latitude"),
    longitude: _joi.default.number().label("Longitude"),
    pickupDate: _joi.default.string().label("pickupDate"),
    pickupTime: _joi.default.string().label("pickupTime"),
    poNumber: _joi.default.string().label("poNumber")
  })),
  receiver: _joi.default.array().items(_joi.default.object({
    id: _joi.default.number().label("Id"),
    deliveryName: _joi.default.string().label("deliveryName"),
    deliveryAddress: _joi.default.string().label("deliveryAddress"),
    latitude: _joi.default.number().label("Latitude"),
    longitude: _joi.default.number().label("Longitude"),
    deliveryDate: _joi.default.string().label("deliveryDate"),
    deliveryTime: _joi.default.string().label("deliveryTime"),
    deliveryNumber: _joi.default.string().label("deliveryNumber")
  })),
  temperature: _joi.default.object({
    actual: _joi.default.string().required().label("actual"),
    min: _joi.default.string().required().label("min"),
    max: _joi.default.string().required().label("max")
  }),
  referenceNumber: _joi.default.string().label("referenceNumber"),
  comment: _joi.default.string().label("comment"),
  broker: _joi.default.object({
    name: _joi.default.string().label("Broker Name"),
    brokerAgent: _joi.default.string().label("Broker Agent"),
    brokerPhone: _joi.default.number().label("Broker Phone"),
    brokerhefsonId: _joi.default.string().label("Broker Hefson Id")
  }),
  dispatchName: _joi.default.string().label("dispatchName"),
  carrierPhone: _joi.default.number().label("carrierPhone"),
  carrierEmergencyPhone: _joi.default.number().label("carrierEmergencyPhone")
});

app.post("/shipment/addShipment", validator.body(shipmentSchema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _shipment.addShipment);
var _default = app;
exports.default = _default;