/*
 * @file: db-schema.js
 * @description: It Contain db schema for load collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const loadSchema = new mongoose.Schema(
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
    temperature: {
      type: Number,
      default: 0,
    },
    loadPrice: {
      /* is like revenue */ type: Number,
      default: 0,
    },
    loadIncome: {
      type: Number,
      default: 0,
    },
    loadExpense: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "expenses",
    },
    pickupDateTime: {
      type: Date,
      default: null,
    },
    deliveryDateTime: {
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

export default loadSchema;
