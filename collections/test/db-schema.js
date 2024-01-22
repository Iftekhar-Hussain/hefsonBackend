/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const testSchema = new mongoose.Schema(
  {
    testingData: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

export default testSchema;
