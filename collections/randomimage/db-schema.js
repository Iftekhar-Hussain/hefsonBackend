/*
 * @file: db-schema.js
 * @description: It Contain db schema for randomimage collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const randomimageSchema = new mongoose.Schema(
  {
    randomTime: {
      type: Date,
      default: null,
    },
    imageLink: {
      type: String,
      default: "",
    },
    category: {
      type: String,
      enum: ["dashboard", "trailer", "sensor"],
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default randomimageSchema;
