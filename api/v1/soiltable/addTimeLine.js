/*
 * @file: add.js
 * @description: It Contain add soiltable router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { addTimeline } from "../../../controllers/soiltable";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/soiltable/addTimeline:
 *  post:
 *   tags: ["Soiltable"]
 *   summary: add soiltable timeline api
 *   description: api used to add soiltable
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: soiltable
 *        description: The soiltable timeline create api
 *        schema:
 *         type: object
 *         required:
 *          - add soiltable timeline
 *         properties:
 *           id:
 *             type: string
 *             required:
 *           processingDate:
 *             type: string
 *             required:
 *           processingTime:
 *             type: string
 *             required:
 *           status:
 *             type: string
 *             required:
 *           location:
 *             type: string
 *             required:
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
  id: Joi.string().trim().required().label("Product Id"),
  processingDate: Joi.string().label("Processing Date"),
  processingTime: Joi.string().label("Processing Time"),
  status: Joi.string().label("Status"),
  location: Joi.string().label("Location"),
});

/*
 * api call to function
 */
app.post(
  "/soiltable/addTimeline",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  addTimeline
);

export default app;