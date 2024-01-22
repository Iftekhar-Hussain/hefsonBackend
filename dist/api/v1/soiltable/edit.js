"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _express = _interopRequireDefault(require("express"));

var _soiltable = require("../../../controllers/soiltable");

var _universal = require("../../../utilities/universal");

var _expressJoiValidation = require("express-joi-validation");

var _joi = _interopRequireDefault(require("@hapi/joi"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: edit.js
 * @description: It Contain edit soiltable router/api.
 * @author: Aditi Goel
 */
const app = (0, _express.default)();
const validator = (0, _expressJoiValidation.createValidator)({
  passError: true
});
/**
 * @swagger
 * /api/v1/soiltable/edit:
 *  put:
 *   tags: ["Soiltable"]
 *   summary: edit soiltable api
 *   description: api used to edit soiltable
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: soiltable
 *        description: The soiltable edit api
 *        schema:
 *         type: object
 *         required:
 *          - edit soiltable
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           name:
 *             type: string
 *             required:
 *           categoryId:
 *             type: string
 *             required:
 *           theme:
 *             type: string
 *             required:
 *           origin:
 *             type: string
 *             required:
 *           isOrganic:
 *             type: boolean
 *             required:
 *           organicDescription:
 *             type: string
 *             required:
 *           transportationDays:
 *             type: number
 *             required:
 *           temperature:
 *             type: string
 *             required:
 *           calories:
 *             type: string
 *             required:
 *           water:
 *             type: string
 *             required:
 *           protien:
 *             type: string
 *             required:
 *           carbs:
 *             type: string
 *             required:
 *           sugar:
 *             type: string
 *             required:
 *           fiber:
 *             type: string
 *             required:
 *           fat:
 *             type: string
 *             required:
 *           storageInst:
 *             type: string
 *             required:
 *           customMessage:
 *             type: string
 *             required:
 *           image:
 *             type: string
 *             required:
 *           productImages:
 *             type: array
 *             items:
 *              type: string
 *           productDetail:
 *             type: string
 *             required:
 *           timeline:
 *             type: array
 *             items:
 *               type: object
 *               properties:
 *                 processingTime:
 *                    type: string
 *                 processingDate:
 *                    type: string
 *                 status:
 *                    type: string
 *                 location:
 *                    type: string
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * Joi validation on input data
 */

const Schema = _joi.default.object({
  id: _joi.default.string().required().label("Soiltable Id"),
  name: _joi.default.string().trim().required().label("Product Name"),
  categoryId: _joi.default.string().required().label("Category Id"),
  theme: _joi.default.string().trim().required().label("Theme"),
  origin: _joi.default.string().trim().required().label("Origin"),
  isOrganic: _joi.default.string().required().label("Is Organic"),
  organicDescription: _joi.default.string().allow("").label("Organic Description"),
  transportationDays: _joi.default.number().required().label("Transportation Days"),
  temperature: _joi.default.string().trim().required().label("Temperature"),
  calories: _joi.default.string().trim().required().label("Calories"),
  water: _joi.default.string().trim().required().label("Water"),
  protien: _joi.default.string().trim().required().label("Protien"),
  carbs: _joi.default.string().trim().required().label("Carbs"),
  sugar: _joi.default.string().trim().required().label("Sugar"),
  fiber: _joi.default.string().trim().required().label("Fiber"),
  fat: _joi.default.string().trim().required().label("Fat"),
  storageInst: _joi.default.string().trim().required().label("Storage Instruction"),
  customMessage: _joi.default.string().trim().required().label("Custom Message"),
  image: _joi.default.string().trim().optional().allow("").label("Custom Message"),
  productImages: _joi.default.array().label("Images").empty(_joi.default.array().length(0)),
  productDetail: _joi.default.string().trim().required().label("Product Detail"),
  timeline: _joi.default.array().items(_joi.default.object({
    processingDate: _joi.default.string().label("Processing Date"),
    processingTime: _joi.default.string().label("Processing Time"),
    status: _joi.default.string().label("Status"),
    location: _joi.default.string().label("Location")
  })).empty(_joi.default.array().length(0))
});
/*
 * api call to function
 */


app.put("/soiltable/edit", validator.body(Schema, {
  joi: {
    convert: true,
    allowUnknown: false
  }
}), _universal.checkTokenCommon, _soiltable.edit);
var _default = app;
exports.default = _default;