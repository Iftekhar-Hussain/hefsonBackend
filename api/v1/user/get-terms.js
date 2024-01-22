/*
 * @file: get-profile.js
 * @description: It Contain terms and conditions  router/api.
 * @author: Ankit Kumar Gautam
 */
import express from "express";
import { createValidator } from "express-joi-validation";
// import Joi from "@hapi/joi";
import { getTerms } from "../../../controllers/user";
// import { checkTokenCommon } from "../../../utilities/universal";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/user/get-terms:
 *  get:
 *   tags: ["User"]
 *   summary: get-profile list api
 *   description: api used to get profile
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * api call to function
 */
app.get("/user/get-terms", getTerms);

export default app;
