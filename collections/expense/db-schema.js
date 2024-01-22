/*
 * @file: db-schema.js
 * @description: It Contain db schema for expense collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const expenseSchema = new mongoose.Schema(
  {
    date: {
      type: String,
      default: null,
    },
    item: [
      {
        name: {
          type: String,
          default: "",
        },
        price: {
          type: String,
          default: "",
        },
      },
    ],
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
    tripId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trips",
    },
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "trucks",
    },
  },
  { timestamps: true }
);

export default expenseSchema;
