/*
 * @file: index.js
 * @description: It Contain function layer for Shipment collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class HistoryClass {
  static saveHistory(payload) {
    return this(payload).save();
  }
  static saveManyHistory(payload) {
    return this.insertMany(payload);
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition) {
    return this.find(condition);
  }
  static updateHistory(payload) {
    const updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.id, updateData, { new: true });
  }
}

DbSchema.loadClass(HistoryClass);

export default Mongoose.model("historys", DbSchema);
