/*
 * @file: index.js
 * @description: It Contain function layer for truck collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class ManufactureClass {
  static saveManufacture(payload) {
    return this(payload).save();
  }
  static saveManyManufacture(payload) {
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

DbSchema.loadClass(ManufactureClass);

export default Mongoose.model("Manufactures", DbSchema);
