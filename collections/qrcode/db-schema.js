/*
 * @file: db-schema.js
 * @description: It Contain db schema for soiltable collection.
 * @author: Ankit Kumar Gautam
 */

import { type } from "@hapi/joi/lib/extend";
import mongoose from "mongoose";

const qrcodeSchema = new mongoose.Schema(
  {
    soiltableId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Soiltables",
    },
    base64: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default qrcodeSchema;
