/*
 * @file: index.js
 * @description: It Contain function layer for Shipment collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class AlarmClass {
  static saveAlarm(payload) {
    return this(payload).save();
  }
  static saveManyAlarm(payload) {
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

DbSchema.loadClass(AlarmClass);

export default Mongoose.model("alarms", DbSchema);
