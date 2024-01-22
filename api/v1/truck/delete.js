/*
 * @file: delete.js
 * @description: It Contain truck router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { deleteTruck } from "../../../controllers/truck";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/truck/delete/{id}:
 *  delete:
 *   tags: ["Truck"]
 *   summary: delete truck
 *   description: Api used to remove truck
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: The truck ID      
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
  id: Joi.string()
    .required()
    .label("Id")
});

/*
* api call to function
*/
app.delete(
  "/truck/delete/:id",
  validator.params(Schema, {
    joi: { convert: true, allowUnknown: false }
  }),
  checkTokenCommon,
  deleteTruck
);

export default app;