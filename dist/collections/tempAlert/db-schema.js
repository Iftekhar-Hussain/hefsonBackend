"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _boolean = _interopRequireDefault(require("@hapi/joi/lib/types/boolean"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for device collection.
 * @author: Ankit Kumar Gautam
 */
const tempAlertSchema = new _mongoose.default.Schema({
  FAssetGUID: {
    type: String,
    default: ""
  },
  FAssetID: {
    type: String,
    default: ""
  },
  FHumidity1: {
    type: Number,
    default: ""
  },
  FGPSTime: {
    type: Date,
    default: ""
  },
  FTemperature1: {
    type: Number,
    default: null
  },
  FLX: {
    type: Number,
    default: null
  },
  FLatitude: {
    type: Number,
    default: null
  },
  FLongitude: {
    type: Number,
    default: null
  },
  FVehicleGUID: {
    type: String,
    default: null
  },
  FVehicleName: {
    type: String,
    default: null
  },
  type: {
    type: Number,
    default: null // 1- temp , 2 - door

  },
  status: {
    type: String,
    default: null // 

  },
  doorFlag: {
    type: Boolean,
    default: false // 

  },
  shipmentId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "shipments"
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
var _default = tempAlertSchema;
exports.default = _default;