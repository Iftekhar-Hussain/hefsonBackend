/*
 * @file: db-schema.js
 * @description: It Contain db schema for truck collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const truckSchema = new mongoose.Schema(
  {
    unitNumber: {
      type: String,
      default: "",
    },
    modelYear: {
      type: Date,
      default: null,
    },
    numberPlate: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    manufacture: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Manufactures",
      required: true
    },
    truckColor: {
      type: mongoose.Schema.Types.ObjectId,
      default: null,
    },
    registrationExpiry: {
      type: Date,
      default: null,
    },
    carrierId:{
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default truckSchema;
