/*
 * @file: db-schema.js
 * @description: It Contain db schema for user collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose, { now } from "mongoose";

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      default: null,
    },
    password: {
      type: String,
      default: null,
    },
    mobile: {
      code: { type: String, default: "+1" },
      number: { type: String, default: 0 },
    },
    phone: {
      type: Number,
      default: 0,
    },
    emergencyPhone: {
      type: Number,
      default: 0,
    },
    dob: {
      type: Date,
      default: null,
    },
    //Hefson Id
    id: {
      type: String,
      default: "",
    },
    image: {
      type: String,
      default: "",
    },
    gender: {
      type: String,
      default: "",
    },
    fullName: {
      type: String,
      default: null,
    },
    firstName: {
      type: String,
      default: null,
    },
    lastName: {
      type: String,
      default: null,
    },
    city: {
      type: String,
      default: null,
    },
    state: {
      type: String,
      default: null,
    },
    postalcode: {
      type: String,
      default: null,
    },
    address: {
      type: String,
      default: "",
    },
    emailVerification: {
      type: String,
      default: "",
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    resetPasswordToken: {
      type: String,
      default: "",
    },
    /*
     * Define role for the user
     * 1 => ADMIN, 2 => CARRIER, 3 => BROKER, 4 => DRIVER, 5 => COMPANY
     */
    role: {
      type: Number,
      default: 4,
    },
    deviceType: {
      type: String,
      default: "",
    },
    deviceId: {
      type: String,
      default: "",
    },
    loginToken: {
      type: String,
      default: "",
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    allowNotification: {
      type: Boolean,
      default: true,
    },
    alertNotification: {
      type: Boolean,
      default: true,
    },
    chatNotification: {
      type: Boolean,
      default: true,
    },
    temperatureAlert: {
      type: Boolean,
      default: true,
    },
    //Carrier
    businessName: {
      type: String,
      default: null,
    },
    dotNumber: {
      type: String,
      default: null,
    },
    dispatchName: {
      type: String,
      default: null,
    },
    emergencyContact: {
      type: Number,
      default: 0,
    },
    socketId: {
      type: String,
      default: null,
    },
    lastSeen: {
      type: Date,
      default: null,
    },
    isOnline: {
      type: Boolean,
      default: false,
    },
    carrierId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    sensorToken: {
      type: String,
      default: null,
    },
    defaultTruck: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trucks",
      default: null,
    },
    defaultTrailer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Trailers",
      default: null,
    },
    defaultDriver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
  },
  { timestamps: true }
);

export default userSchema;
