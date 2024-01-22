/*
 * @file: db-schema.js
 * @description: It Contain db schema for room collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";

const Schema = Mongoose.Schema;

const roomSchema = new Schema(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
      },
    ],
    type: { type: Number, default: 1 }, //1=> text, 2=> image
    status: { type: Number, default: 1 }, // 0=> inactive, 1=> active
    lastMessage: { type: String, default: "" },
    lastMessageBy: { type: Mongoose.Schema.Types.ObjectId, ref: "User" },
    lastMessageDate: { type: Date, default: new Date() },
    unreadMessageCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

export default roomSchema;
