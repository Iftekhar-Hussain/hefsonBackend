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
const sensorSchema = new _mongoose.default.Schema({
  FGUID: {
    type: String,
    default: ""
  },
  FVehicleName: {
    type: String,
    default: ""
  },
  FAssetGUID: {
    type: String,
    default: ""
  },
  FAssetID: {
    type: String,
    default: ""
  },
  FAssetTypeID: {
    type: Number,
    default: null
  },
  FVehicleCode: {
    type: String,
    default: null
  },
  FVehicleTypeID: {
    type: Number,
    default: null
  },
  FDescription: {
    type: String,
    default: null
  },
  FOperateType: {
    type: String,
    default: null
  },
  FVIN: {
    type: String,
    default: null
  },
  FAgentGUID: {
    type: String,
    default: ""
  },
  FAgentName: {
    type: String,
    default: null
  },
  FGroupGUID: {
    type: String,
    default: ""
  },
  FGroupName: {
    type: String,
    default: null
  },
  FMainDriverGUID: {
    type: String,
    default: null
  },
  FDriverName: {
    type: String,
    default: null
  },
  FDriverPhoneNumber: {
    type: Number,
    default: null
  },
  FCreateTime: {
    type: Date,
    default: null
  },
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users",
    default: null
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
var _default = sensorSchema;
exports.default = _default;