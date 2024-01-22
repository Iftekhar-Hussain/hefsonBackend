/*
 * @file: db-schema.js
 * @description: It Contain db schema for device collection.
 * @author: Ankit Kumar Gautam
 */

import boolean from "@hapi/joi/lib/types/boolean";
import mongoose from "mongoose";

const tempAlertSchema = new mongoose.Schema(
  {
    FAssetGUID: {
      type: String,
      default: "",
    },
    FAssetID: {
      type: String,
      default: "",
    },
    FHumidity1: {
      type: Number,
      default: "",
    },
    FGPSTime: {
      type: Date,
      default: "",
    },
    FTemperature1: {
      type: Number,
      default: null,
    },
    FLX: {
      type: Number,
      default: null,
    },
    FLatitude: {
      type: Number,
      default: null,
    },
    FLongitude: {
      type: Number,
      default: null,
    },
    FVehicleGUID: {
      type: String,
      default: null,
    },
    FVehicleName: {
      type: String,
      default: null,
    },
    type: {
      type: Number,
      default: null, // 1- temp , 2 - door
    },
    status: {
      type: String,
      default: null, // 
    },
    doorFlag: {
      type: Boolean,
      default: false, // 
    },
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shipments",
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

export default tempAlertSchema;
