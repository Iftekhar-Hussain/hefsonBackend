/*
 * @file: db-schema.js
 * @description: It Contain db schema for shipment collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const mapDataSchema = new mongoose.Schema(
  {
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "shipments",
      default:null
    },
    trailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trailers",
      default:null
    },
    deviceId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "devices",
      default:null
    },
    Bat: {
      type: Number,
      default: 0,
    },
    CID: {
      type: Number,
      default: 0,
    },
    Dir: {
      type: Number,
      default: 0,
    },
    GT: {
      type: Date,
      default: null,
    },
    Hum1: {
      type: Number,
      default: 0,
    },
    Hum2: {
      type: Number,
      default: 0,
    },
    LAC: {
      type: Number,
      default: 0,
    },
    LType: {
      type: Number,
      default: 0,
    },
    Lat: {
      type: Number,
      default: 0,
    },
    Lon: {
      type: Number,
      default: 0,
    },
    MCC: {
      type: Number,
      default: null,
    },
    MNC: {
      type: Number,
      default: null,
    },
    Mil: {
      type: Number,
      default: null,
    },
    RT: {
      type: Date,
      default: null,
    },
    Speed: {
      type: Number,
      default: 0,
    },
    Temp1: {
      type: Number,
      default: 0,
    },
    Temp2: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

export default mapDataSchema;
