/*
 * @file: db-schema.js
 * @description: It Contain db schema for soiltable collection.
 * @author: Ankit Kumar Gautam
 */

import { type } from "@hapi/joi/lib/extend";
import mongoose from "mongoose";

const stateSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      default: null,
    },
    state: [
      {
        name: {
          type: String,
          default: null,
        },
      },
    ],
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    }
  },
  { timestamps: true }
);

export default stateSchema;
