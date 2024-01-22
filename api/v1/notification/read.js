/*
 * @file: edit.js
 * @description: It Contain edit trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { markAsRead } from "../../../controllers/notification";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/notification/markAsRead:
 *  put:
 *   tags: ["Notification"]
 *   summary: update status trailer api
 *   description: api used to update trailer status
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer update status api
 *        schema:
 *         type: object
 *         required:
 *          - update trailer status
 *         properties:
 *           id:
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
  id: Joi.string().trim().required().label("Notification Id"),
});

/*
 * api call to function
 */
app.put(
  "/notification/markAsRead",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  markAsRead
);

export default app;
