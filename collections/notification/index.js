/*
 * @file: index.js
 * @description: It Contain function layer for notification collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from "mongoose";
import dbSchema from "./db-schema";
import { LIMIT, ROLE } from "../../utilities/constants";
var ObjectId = require("mongodb").ObjectID;

class NotificationClass {
  static saveNotification(payload) {
    return this(payload).save();
  }

  static findListNotifications(payload, match) {
    const query = [
      {
        $project: {
          text: 1,
          type: 1,
          status: 1,
          toUserId: 1,
          createdAt: 1,
        },
      },
      { $match: match },
      { $sort: { createdAt: -1 } },
    ];
    const pagination = [
      { $skip: payload.pageNum ? (payload.pageNum - 1) * payload.limit : 0 },
      { $limit: payload.limit },
    ];
    const aggregateQuery = this.aggregate([...query, ...pagination]);
    return {
      list: aggregateQuery,
      totalRecords: this.aggregate([...query]),
    };
  }
}

dbSchema.loadClass(NotificationClass);

export default mongoose.model("Notifications", dbSchema);
