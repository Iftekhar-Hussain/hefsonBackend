/*
 * @file: index.js
 * @description: It Contain function layer for trailer collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class LogClass {
  static saveLog(payload) {
    return this(payload).save();
  }
}

DbSchema.loadClass(LogClass);

export default Mongoose.model("Logs", DbSchema);
