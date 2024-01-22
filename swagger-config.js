/*
 * @file: swagger-config.js
 * @description: It Contain swagger configrations.
 * @author: Aditi Goel
 */
import swaggerJsDocs from "swagger-jsdoc";
import config from "config";
const { swaggerURL, swaggerPort } = config.get("app");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Trucking Tool Application project apis",
      version: "1.0",
      description: "All api end points",
      contact: {
        name: "Aditi Goel",
      },
      servers: [`${swaggerURL}`],
    },
    produces: ["application/json"],
    host: `${swaggerPort}`,
  },
  apis: [
    "./api/v1/user/*.js",
    "./api/v1/truck/*.js",
    "./api/v1/trailer/*.js",
    "./api/v1/soiltable/*.js",
    "./api/v1/category/*.js",
    "./api/v1/file/*.js",
    "./api/v1/shipment/*.js",
    "./api/v1/randomimage/*.js",
    "./api/v1/qrcode/*.js",
    "./api/v1/chat/*.js",
    "./api/v1/driver/*.js",
    "./api/v1/devices/*.js",
    "./api/v1/manufacture/*.js",
    "./api/v1/states/*.js",
    "./api/v1/notification/*.js"
  ],
  layout: "AugmentingLayout",
};
export default swaggerJsDocs(swaggerOptions);
