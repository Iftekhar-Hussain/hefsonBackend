/*
 * @file: db-schema.js
 * @description: It Contain db schema for message collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
const Schema = Mongoose.Schema;

const messageSchema = new Schema(
  {
    threadId: { type: String },
    type: { type: String, enum: ["one2one", "group"] },
    senderId: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    receiverId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    groupId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Groups",
      default: null,
    },
    message: { type: String, default: "" },
  },
  { timestamps: true }
);

export default messageSchema;
