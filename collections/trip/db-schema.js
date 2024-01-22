/*
 * @file: db-schema.js
 * @description: It Contain db schema for trip collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const tripSchema = new mongoose.Schema(
  {
    from: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      default: "",
    },
    pickupDateTime: {
      type: Date,
      default: null,
    },
    deliveryDateTime: {
      type: Date,
      default: null,
    },
    lat: {
      type: String,
      default: null,
    },
    long: {
      type: String,
      default: null,
    },
    distance: {
      type: Number,
      default: 0,
    },

    status: {
      type: Number,
      default: 1 /* 1=>waiting 2=> pickup 3=> delivered */,
    },
    load: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "loads",
      },
    ],
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trucks",
    },
    driverId: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "users",
      },
    ],
    brokerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    expenseId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expenses",
    },
  },
  { timestamps: true }
);

export default tripSchema;
