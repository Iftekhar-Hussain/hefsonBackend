/*
 * @file: index.js
 * @description: It Contain function layer for expense collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class ExpenseClass {
  static saveExpense(payload) {
    return this(payload).save();
  }
  static saveManyExpense(payload) {
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

DbSchema.loadClass(ExpenseClass);

export default Mongoose.model("expenses", DbSchema);
