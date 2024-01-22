/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const logSchema = new mongoose.Schema(
  {    
    FVehicleName: {
      type: String,
      default: "",
    },
    FAssetID: {
      type: String,
      default: "",
    },
    FGPSTime: {
      type: String,
      default: "",
    },
    Bat: {
      type: Number,
      default: "",
    },
    TH: {
      type: String,
      default: "",
    },
    Lx: {
      type: Number,
      default: "",
    },
    Vib: {
      type: Number,
      default: "",
    },
    Press: {
      type: Number,
      default: "",
    },
    Acce: {
      type: String,
      default: "",
    },
    Pos: {
      type: String,
      default: "",
    },
    FD: {
      type: Number,
      default: "",
    },
    FLongitude: {
      type: Number,
      default: "",
    },
    FLatitude: {
      type: Number,
      default: "",
    },
    FDir: {
      type: Number,
      default: "",
    },
    FTemp1: {
      type: Number,
      default: "",
    },
    FTemp2: {
      type: Number,
      default: "",
    },
    FHum1: {
      type: Number,
      default: "",
    },
    FHum2: {
      type: Number,
      default: "",
    },
  },
  { timestamps: true }
);

export default logSchema;