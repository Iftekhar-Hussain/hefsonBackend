/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const trailerSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      default: "",
    },
    modelYear: {
      type: Date,
      default: null,
    },
    numberPlate: {
      type: String,
      default: null,
    },
    engineHours: {
      type: Number,
      default: null,
    },
    currentHours: {
      type: Number,
      default: 0,
    },
    state: {
      type: String,
      default: null,
    },
    manufacturer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufactures",
      required: true,
    },
    registrationExpiry: {
      type: Date,
      default: null,
    },
    sensorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Sensors",
      required: true,
    },
    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    timeline: [
      {
        status: {
          type: String,
          default: null,
        },
        comments: {
          type: String,
          default: null,
        },
        amount: {
          type: Number,
          default: 0,
        },
        createTime: {
          type: Date,
          default: null,
        },
      },
    ],
  },
  { timestamps: true }
);

export default trailerSchema;
