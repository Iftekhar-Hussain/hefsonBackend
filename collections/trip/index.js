/*
 * @file: index.js
 * @description: It Contain function layer for trip collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class TripClass {
  static saveTrip(payload) {
    return this(payload).save();
  }
  static saveManyTrip(payload) {
    return this.insertMany(payload);
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition) {
    return this.find(condition);
  }
  static update(payload) {
    const updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.id, updateData, { new: true });
  }
}

DbSchema.loadClass(TripClass);

export default Mongoose.model("Trips", DbSchema);
