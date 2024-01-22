/*
 * @file: index.js
 * @description: It Contain function layer for Shipment collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class MapDataClass {
  static saveMapData(payload) {
    return this(payload).save();
  }
  static saveManyMapData(payload) {
    return this.insertMany(payload);
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition) {
    return this.find(condition);
  }
  static updateMapData(payload) {
    const updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.id, updateData, { new: true });
  }
}

DbSchema.loadClass(MapDataClass);

export default Mongoose.model("mapDatas", DbSchema);
