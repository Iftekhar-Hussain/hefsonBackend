/*
 * @file: db-schema.js
 * @description: It Contain db schema for chat collection.
 * @author: Aditi
 */

import Mongoose from "mongoose";

const participantSchema = new Mongoose.Schema(
  {
    threadId: {
      type: String,
      default: null,
    },
    type: { type: String, enum: ["one2one", "group"] },
    groupId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Groups",
      default: null,
    },
    messageId: { type: Mongoose.Schema.Types.ObjectId, ref: "Messages" },
    senderId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Users",
      required: true,
    },
    receiverId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Users",
      default: null,
    },
    lastMessageId: {
      type: Mongoose.Schema.Types.ObjectId,
      ref: "Messages",
    },
    lastMessage: {
      type: String,
      default: null,
    },
    isDelivered: {
      type: Boolean,
      default: false,
    },
    isRead: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
    },
    isSender: {
      type: Boolean,
      default: false,
    },
    isReceiver: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

export default participantSchema;
