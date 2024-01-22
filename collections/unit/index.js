/*
 * @file: index.js
 * @description: It Contain function layer for unit collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class UnitClass {
  static saveUnit(payload) {
    return this(payload).save();
  }
  static saveManyUnit(payload) {
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

DbSchema.loadClass(UnitClass);

export default Mongoose.model("Units", DbSchema);
