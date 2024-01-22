"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for shipment collection.
 * @author: Ankit Kumar Gautam
 */
const mapDataSchema = new _mongoose.default.Schema({
  shipmentId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "shipments",
    default: null
  },
  trailerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "trailers",
    default: null
  },
  deviceId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "devices",
    default: null
  },
  Bat: {
    type: Number,
    default: 0
  },
  CID: {
    type: Number,
    default: 0
  },
  Dir: {
    type: Number,
    default: 0
  },
  GT: {
    type: Date,
    default: null
  },
  Hum1: {
    type: Number,
    default: 0
  },
  Hum2: {
    type: Number,
    default: 0
  },
  LAC: {
    type: Number,
    default: 0
  },
  LType: {
    type: Number,
    default: 0
  },
  Lat: {
    type: Number,
    default: 0
  },
  Lon: {
    type: Number,
    default: 0
  },
  MCC: {
    type: Number,
    default: null
  },
  MNC: {
    type: Number,
    default: null
  },
  Mil: {
    type: Number,
    default: null
  },
  RT: {
    type: Date,
    default: null
  },
  Speed: {
    type: Number,
    default: 0
  },
  Temp1: {
    type: Number,
    default: 0
  },
  Temp2: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
var _default = mapDataSchema;
exports.default = _default;