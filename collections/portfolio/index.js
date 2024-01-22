/*
 * @file: index.js
 * @description: It Contain function layer for user collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class ProtfolioClass {
  static saveUser(payload) {
    return this(payload).save();
  }
  static saveManyUser(payload) {
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

  static updateDri(payload) {
    const updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findOneAndUpdate({driverId:payload.id}, updateData, { new: true });
  }
}

DbSchema.loadClass(ProtfolioClass);

export default Mongoose.model("protfolio", DbSchema);
