/*
 * @file: db-schema.js
 * @description: It Contain db schema for manufacture collection.
 * @author: Ankit Kumar Gautam
 */

import boolean from "@hapi/joi/lib/types/boolean";
import mongoose from "mongoose";

const manufactureSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: "",
    },
    feature: [
      {
        color: {
          type: String,
          default: "",
        },
        image: {
          type: String,
          default: null,
        },
      },
    ],
    image: {
      type: String,
      default: null,
    },
    type: {
      type: Number,
      default: null,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

export default manufactureSchema;
