/*
 * @file: db-schema.js
 * @description: It Contain db schema for device collection.
 * @author: Ankit Kumar Gautam
 */

import boolean from "@hapi/joi/lib/types/boolean";
import mongoose from "mongoose";

const deviceSchema = new mongoose.Schema(
  {
    FVehicleGUID: {
      type: String,
      default: "",
    },
    FVehicleName: {
      type: String,
      default: "",
    },
    FAssetGUID: {
      type: String,
      default: "",
    },
    FAssetID: {
      type: String,
      default: "",
    },
    FAssetTypeID: {
      type: Number,
      default: null,
    },
    FLongitude: {
      type: Number,
      default: null,
    },
    FLatitude: {
      type: Number,
      default: null,
    },
    FSpeed: {
      type: Number,
      default: null,
    },
    FDirection: {
      type: Number,
      default: null,
    },
    FMileage: {
      type: Number,
      default: null,
    },
    FGPSTime: {
      type: Date,
      default: "",
    },
    FGPSTimestamp: {
      type: Number,
      default: null,
    },
    FRecvTime: {
      type: Date,
      default: "",
    },
    FRecvTimestamp: {
      type: Number,
      default: null,
    },
    FLocationType: {
      type: Number,
      default: null,
    },
    FCellSignal: {
      type: Number,
      default: null,
    },
    FGPSSignal: {
      type: Number,
      default: null,
    },
    FMNC: {
      type: Number,
      default: null,
    },
    FMCC: {
      type: Number,
      default: null,
    },
    FLAC: {
      type: Number,
      default: null,
    },
    FCELLID: {
      type: Number,
      default: null,
    },
    FBattery: {
      type: Number,
      default: null,
    },
    FACC: {
      type: Number,
      default: null,
    },
    FAlarm: {
      type: Number,
      default: null,
    },
    FLockRope: {
      type: Number,
      default: null,
    },
    FLockStatus: {
      type: Number,
      default: null,
    },
    FFuelCut: {
      type: Number,
      default: null,
    },
    FDoor: {
      type: Number,
      default: null,
    },
    FMotor: {
      type: Number,
      default: null,
    },
    FFuelValue1: {
      type: Number,
      default: null,
    },
    FFuelValue2: {
      type: Number,
      default: null,
    },
    FFuelValue3: {
      type: Number,
      default: null,
    },
    FTemperature1: {
      type: Number,
      default: null,
    },
    FTemperature2: {
      type: Number,
      default: null,
    },
    FTemperature3: {
      type: Number,
      default: null,
    },
    FTemperature4: {
      type: Number,
      default: null,
    },
    FTemperature5: {
      type: Number,
      default: null,
    },
    FTemperature6: {
      type: Number,
      default: null,
    },
    FHumidity1: {
      type: Number,
      default: null,
    },
    FHumidity2: {
      type: Number,
      default: null,
    },
    FHumidity3: {
      type: Number,
      default: null,
    },
    FHumidity4: {
      type: Number,
      default: null,
    },
    FHumidity5: {
      type: Number,
      default: null,
    },
    FHumidity6: {
      type: Number,
      default: null,
    },
    FExpandProto: [],
    SubAssets: {},
    FClassify: {
      type: Number,
      default: null,
    },
    FRunStatus: {
      type: Number,
      default: null,
    },
    FAwaken: {
      type: Number,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default deviceSchema;
