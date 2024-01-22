/*
 * @file: logout.js
 * @description: It Contain logout router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { logout } from "../../../controllers/user";
import { checkTokenCommon } from "../../../utilities/universal";

const app = express();

/**
 * @swagger
 * /api/v1/user/logout:
 *  delete:
 *   tags: ["User"]
 *   summary: user / business / admin logout api
 *   description: api used to logout user / business / admin
 *   security:
 *    - OAuth2: [admin]   # Use Authorization
 *   parameters:
 *      - in: header
 *        name: Authorization
 *        type: string
 *        required: true
 *   responses:
 *    '200':
 *      description: success
 *    '400':
 *      description: fail
 */

/*
 * api call to function
 */
app.delete("/user/logout", checkTokenCommon, logout);

export default app;
