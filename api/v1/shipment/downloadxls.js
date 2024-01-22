

// /*
//  * @file: addShipment.js
//  * @description: It Contain addShipment router
//  * @author: Ankit Kumar Gautam
//  */
// import express from "express";
// import { createValidator } from "express-joi-validation";
// import Joi from "@hapi/joi";

// import { checkTokenCommon } from "../../../utilities/universal";
// import { downloadxlsFile } from "../../../controllers/shipment";
// const app = express();
// const validator = createValidator({ passError: true });

// /**
//  * @swagger
//  * /api/v1/shipment/downloadxls:
//  *  post:
//  *   tags: ["Shipment"]
//  *   summary: add Shipment api
//  *   description: api used to add Shipment
//  *   security:
//  *    - OAuth2: [admin]   # Use Authorization
//  *   parameters:
//  *      - in: header
//  *        name: Authorization
//  *        type: string
//  *        required: true
//  *      - in: body
//  *        name: driver
//  *        description: The driver to update.
//  *        schema:
//  *         type: object
//  *         required:
//  *          - driver update
//  *         properties:
//  *           id:
//  *             type: string
//  *             required:
//  *   responses:
//  *    '200':
//  *      description: success
//  *    '400':
//  *      description: fail
//  */

// const shipmentSchema = Joi.object({
//   id: Joi.string().label("Truck Id"),
// });

// app.post(
//   "/shipment/downloadxls",
//   validator.body(shipmentSchema, {
//     joi: { convert: true, allowUnknown: false },
//   }),
//   checkTokenCommon,
//   downloadxlsFile
// );

// export default app;






/*
 * @file: add.js
 * @description: It Contain add trailer router/api.
 * @author: Aditi Goel
 */
import express from "express";
import { downloadXls } from "../../../controllers/shipment";
import { checkTokenCommon } from "../../../utilities/universal";
import { createValidator } from "express-joi-validation";
import Joi from "@hapi/joi";
const app = express();
const validator = createValidator({ passError: true });

/**
 * @swagger
 * /api/v1/shipment/downloadXls:
 *  post:
 *   tags: ["Shipment"]
 *   summary: add trailer api
 *   description: api used to add trailer
 *   parameters:
 *      - in: header
 *        name: authorization
 *        required:
 *      - in: body
 *        name: trailer
 *        description: The trailer create api
 *        schema:
 *         type: object
 *         required:
 *          - add trailer
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
  id: Joi.string().trim().required().label("Unit Number")
});

/*
 * api call to function
 */
app.post(
  "/shipment/downloadXls",
  validator.body(Schema, {
    joi: { convert: true, allowUnknown: false },
  }),
  checkTokenCommon,
  downloadXls
);

export default app;
