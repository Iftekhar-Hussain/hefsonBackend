/*
 * @file: db-schema.js
 * @description: It Contain db schema for location collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const locationSchema = new mongoose.Schema(
  {
    latitude: {
      type: Number,
      default: 0,
    },
    longitude: {
      type: Number,
      default: 0,
    },
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trucks",
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trips",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default locationSchema;
