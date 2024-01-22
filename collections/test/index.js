/*
 * @file: index.js
 * @description: It Contain function layer for trailer collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class TestClass {
  static saveTest(payload) {
    return this(payload).save();
  }
}

DbSchema.loadClass(TestClass);

export default Mongoose.model("Tests", DbSchema);
