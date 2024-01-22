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
const alarmSchema = new _mongoose.default.Schema({
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
var _default = alarmSchema;
/*
 * @file: db-schema.js
 * @description: It Contain db schema for device collection.
 * @author: Ankit Kumar Gautam
 */
// import boolean from "@hapi/joi/lib/types/boolean";
// import mongoose from "mongoose";
// const alarmSchema = new mongoose.Schema(
//   {
//     FGUID: {
//       type: String,
//       default: "",
//     },
//     FVehicleGUID: {
//       type: String,
//       default: "",
//     },
//     FVehicleName: {
//       type: String,
//       default: "",
//     },
//     FAssetGUID: {
//       type: String,
//       default: "",
//     },
//     FAssetID: {
//       type: String,
//       default: null,
//     },
//     FAssetTypeID: {
//       type: Number,
//       default: null,
//     },
//     FSubAssetID: {
//       type: Number,
//       default: null,
//     },
//     FDataType: {
//       type: Number,
//       default: null,
//     },
//     FCurrentStatus: {
//       type: Number,
//       default: null,
//     },
//     FStartTime: {
//       type: Date,
//       default: null,
//     },
//     FStartLongitude: {
//       type: Number,
//       default: null,
//     },
//     FStartLatitude: {
//       type: Number,
//       default: null,
//     },
//     FEndLongitude: {
//       type: Number,
//       default: null,
//     },
//     FEndLatitude: {
//       type: Number,
//       default: null,
//     },
//     FEndTime: {
//       type: Date,
//       default: null,
//     },
//     FStartSpeed: {
//       type: Number,
//       default: null,
//     },
//     FEndSpeed: {
//       type: Number,
//       default: null,
//     },
//     FKeepSeconds: {
//       type: Number,
//       default: null,
//     },
//     FStartMileage: {
//       type: Number,
//       default: null,
//     },
//     FEndMileage: {
//       type: Number,
//       default: null,
//     },
//     FKeepDistance: {
//       type: Number,
//       default: null,
//     },
//     FCreateTime:{
//       type:Date,
//       default:null
//     },
//     FStartCell:{
//       type:String,
//       default:null
//     },
//     FDescribeJSON:{
//       type:String,
//       default:null
//     },
//     shipmentId: {
//       type: mongoose.Schema.Types.ObjectId,
//       ref: "shipments",
//     },
//     isDeleted: {
//       type: Boolean,
//       default: false,
//     },
//     isActive: {
//       type: Boolean,
//       default: true,
//     },
//   },
//   { timestamps: true }
// );
// export default alarmSchema;

exports.default = _default;