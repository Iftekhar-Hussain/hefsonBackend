/*
 * @file: index.js
 * @description: It Contain function layer for qrcode collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class QrcodeClass {
  static saveQrcode(payload) {
    return this(payload).save();
  }
  static saveManyQrcode(payload) {
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

DbSchema.loadClass(QrcodeClass);

export default Mongoose.model("Qrcodes", DbSchema);
