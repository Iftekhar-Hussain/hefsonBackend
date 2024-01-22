/*
 * @file: db-schema.js
 * @description: It Contain db schema for unit collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const unitSchema = new mongoose.Schema(
  {
    items: [
      {
        name: {
          type: String,
          default: "",
        },
        price: {
          type: String,
          default: "",
        },
        category: {
          type: String,
          default: "",
        },
      },
    ],
    from: {
      type: String,
      default: "",
    },
    to: {
      type: String,
      default: "",
    },
    unitRevenue: {
      type: Number,
      default: 0,
    },
    unitIncome: {
      type: Number,
      default: 0,
    },
    unitExpense: {
      type: Number,
      default: 0,
    },
    pickupDateTime: {
      type: Date,
      default: null,
    },

    status: {
      type: Number,
      default: 1 /* 1=>waiting 2=> pickup 3=> delivered */,
    },
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trucks",
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default unitSchema;
