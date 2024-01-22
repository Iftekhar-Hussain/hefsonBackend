/*
 * @file: delete.js
 * @description: It Contain trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
import { deleteTrailer } from "../../../controllers/trailer";
const app = express();
const validator = createValidator({ passError: true });
import { checkTokenCommon } from "../../../utilities/universal";
// https://swagger.io/docs/specification/2-0/describing-parameters

/**
 * @swagger
 * /api/v1/trailer/delete/{id}:
 *  delete:
 *   tags: ["Trailer"]
 *   summary: delete trailer
 *   description: Api used to remove trailer
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required: true
 *      - in: path
 *        name: id
 *        required: true
 *        schema:
 *         type: string
 *         description: The trailer ID
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
  id: Joi.string().required().label("Id"),
});

/*
 * api call to function
 */
app.delete(
  "/trailer/delete/:id",
  validator.params(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  deleteTrailer
);

export default app;
