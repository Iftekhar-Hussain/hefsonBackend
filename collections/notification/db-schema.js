/*
 * @file: db-schema.js
 * @description: It Contain db schema for notification collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    text: {
      type: String,
      default: null,
    },
    type: {
      type: String,
      default: null,
    },
    senderId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    receiverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
    },
    trailerId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trailers",
      default: null,
    },
    shipmentId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Shipments",
      default: null,
    },
    truckId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trucks",
      default: null,
    },
    driverId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    latitude: {
      type: Number,
      default: null,
    },
    longitude: {
      type: Number,
      default: null,
    },
    temperature: {
      type: Number,
      default: null,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isArchived: {
      type: Boolean,
      default: false,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default notificationSchema;
