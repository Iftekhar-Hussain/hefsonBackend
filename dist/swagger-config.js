"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _swaggerJsdoc = _interopRequireDefault(require("swagger-jsdoc"));

var _config = _interopRequireDefault(require("config"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: swagger-config.js
 * @description: It Contain swagger configrations.
 * @author: Aditi Goel
 */
const {
  swaggerURL,
  swaggerPort
} = _config.default.get("app");

const swaggerOptions = {
  swaggerDefinition: {
    info: {
      title: "Trucking Tool Application project apis",
      version: "1.0",
      description: "All api end points",
      contact: {
        name: "Aditi Goel"
      },
      servers: [`${swaggerURL}`]
    },
    produces: ["application/json"],
    host: `${swaggerPort}`
  },
  apis: ["./api/v1/user/*.js", "./api/v1/truck/*.js", "./api/v1/trailer/*.js", "./api/v1/soiltable/*.js", "./api/v1/category/*.js", "./api/v1/file/*.js", "./api/v1/shipment/*.js", "./api/v1/randomimage/*.js", "./api/v1/qrcode/*.js", "./api/v1/chat/*.js", "./api/v1/driver/*.js", "./api/v1/devices/*.js", "./api/v1/manufacture/*.js", "./api/v1/states/*.js", "./api/v1/notification/*.js"],
  layout: "AugmentingLayout"
};

var _default = (0, _swaggerJsdoc.default)(swaggerOptions);

exports.default = _default;