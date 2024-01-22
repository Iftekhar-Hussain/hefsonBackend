"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */
const logSchema = new _mongoose.default.Schema({
  FVehicleName: {
    type: String,
    default: ""
  },
  FAssetID: {
    type: String,
    default: ""
  },
  FGPSTime: {
    type: String,
    default: ""
  },
  Bat: {
    type: Number,
    default: ""
  },
  TH: {
    type: String,
    default: ""
  },
  Lx: {
    type: Number,
    default: ""
  },
  Vib: {
    type: Number,
    default: ""
  },
  Press: {
    type: Number,
    default: ""
  },
  Acce: {
    type: String,
    default: ""
  },
  Pos: {
    type: String,
    default: ""
  },
  FD: {
    type: Number,
    default: ""
  },
  FLongitude: {
    type: Number,
    default: ""
  },
  FLatitude: {
    type: Number,
    default: ""
  },
  FDir: {
    type: Number,
    default: ""
  },
  FTemp1: {
    type: Number,
    default: ""
  },
  FTemp2: {
    type: Number,
    default: ""
  },
  FHum1: {
    type: Number,
    default: ""
  },
  FHum2: {
    type: Number,
    default: ""
  }
}, {
  timestamps: true
});
var _default = logSchema;
exports.default = _default;