/*
 * @file: db-schema.js
 * @description: It Contain db schema for soiltable collection.
 * @author: Ankit Kumar Gautam
 */

import { type } from "@hapi/joi/lib/extend";
import mongoose from "mongoose";

const soiltableSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      default: null,
    },
    slug: {
      type: String,
      default: null,
    },
    code: {
      type: String,
      default: null,
    },
    categoryId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Categories",
    },
    theme: {
      type: String,
      default: "light",
    },
    origin: {
      type: String,
      default: null,
    },
    isOrganic: {
      type: String,
      default: null,
    },
    organicDescription: {
      type: String,
      default: null,
    },
    transportationDays: {
      type: Number,
      default: 0,
    },
    temperature: {
      type: String,
      default: null,
    },
    calories: {
      type: String,
      default: null,
    },
    water: {
      type: String,
      default: null,
    },
    protien: {
      type: String,
      default: null,
    },
    carbs: {
      type: String,
      default: null,
    },
    sugar: {
      type: String,
      default: null,
    },
    fiber: {
      type: String,
      default: null,
    },
    fat: {
      type: String,
      default: null,
    },
    storageInst: {
      type: String,
      default: null,
    },
    customMessage: {
      type: String,
      default: null,
    },
    image: {
      type: String,
      default: null,
    },
    productImages: [{ type: String }],
    timeline:[],
    productDetail: {
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
    companyId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "users",
    },
  },
  { timestamps: true }
);

export default soiltableSchema;
