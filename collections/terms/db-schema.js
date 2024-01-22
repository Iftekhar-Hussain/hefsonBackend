/*
 * @file: db-schema.js
 * @description: It Contain db schema for terms collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const termsSchema = new mongoose.Schema(
  {
    terms: {
      type: Array,
      default: null,
    },
  },
  { timestamps: true }
);

export default termsSchema;
