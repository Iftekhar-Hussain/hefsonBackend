/*
 * @file: edit.js
 * @description: It Contain edit soiltable router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { edit } from "../../../controllers/soiltable";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

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
const Schema = Joi.object({
  id: Joi.string().required().label("Soiltable Id"),
  name: Joi.string().trim().required().label("Product Name"),
  categoryId: Joi.string().required().label("Category Id"),
  theme: Joi.string().trim().required().label("Theme"),
  origin: Joi.string().trim().required().label("Origin"),
  isOrganic: Joi.string().required().label("Is Organic"),
  organicDescription: Joi.string().allow("").label("Organic Description"),
  transportationDays: Joi.number().required().label("Transportation Days"),
  temperature: Joi.string().trim().required().label("Temperature"),
  calories: Joi.string().trim().required().label("Calories"),
  water: Joi.string().trim().required().label("Water"),
  protien: Joi.string().trim().required().label("Protien"),
  carbs: Joi.string().trim().required().label("Carbs"),
  sugar: Joi.string().trim().required().label("Sugar"),
  fiber: Joi.string().trim().required().label("Fiber"),
  fat: Joi.string().trim().required().label("Fat"),
  storageInst: Joi.string().trim().required().label("Storage Instruction"),
  customMessage: Joi.string().trim().required().label("Custom Message"),
  image: Joi.string().trim().optional().allow("").label("Custom Message"),
  productImages: Joi.array().label("Images").empty(Joi.array().length(0)),
  productDetail: Joi.string().trim().required().label("Product Detail"),
  timeline: Joi.array().items(
    Joi.object({
      processingDate: Joi.string().label("Processing Date"),
      processingTime: Joi.string().label("Processing Time"),
      status: Joi.string().label("Status"),
      location: Joi.string().label("Location"),
    })
  ).empty(Joi.array().length(0)),
});

/*
 * api call to function
 */
app.put(
  "/soiltable/edit",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  edit
);

export default app;
