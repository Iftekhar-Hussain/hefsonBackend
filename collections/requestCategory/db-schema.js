/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const requestCategorySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Users",
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isApproved: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default requestCategorySchema;
