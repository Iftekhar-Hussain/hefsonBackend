/*
 * @file: db-schema.js
 * @description: It Contain db schema for message collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
const Schema = Mongoose.Schema;
const participant = new Mongoose.Schema({
  userId: {
    type: Mongoose.Schema.Types.ObjectId,
    ref: "Users",
  },
});
const groupSchema = new Schema(
  {
    name: { type: String, default: null },
    createdBy: { type: Mongoose.Schema.Types.ObjectId, ref: "Users" },
    users: [participant],
  },
  { timestamps: true }
);

export default groupSchema;
