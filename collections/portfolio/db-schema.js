/*
 * @file: db-schema.js
 * @description: It Contain db schema for portfolio collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const portfolioSchema = new mongoose.Schema(
  {
    licenseNo: {
      type: String,
      default: "",
    },
    licenseExp: {
      type: Date,
      default: "",
    },
    issuedState: {
      type: String,
      default: "",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    totalMiles: {
      type: Number,
      default: 0,
    },
    totalShipment: {
      type: Number,
      default: 0,
    },
    totalPay: {
      type: Number,
      default: 0,
    },
    incidentCount: [
      {
        incidnentName: {
          type: String,
          default: "",
        },
        incidentDate: {
          type: Date,
          default: null,
        },
        incidentDescriptiion: {
          type: String,
          default: "",
        },
      },
    ],
    ownerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
  },
  { timestamps: true }
);

export default portfolioSchema;
