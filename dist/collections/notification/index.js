"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbSchema = _interopRequireDefault(require("./db-schema"));

var _constants = require("../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It Contain function layer for notification collection.
 * @author: Ankit Kumar Gautam
 */
var ObjectId = require("mongodb").ObjectID;

class NotificationClass {
  static saveNotification(payload) {
    return this(payload).save();
  }

  static findListNotifications(payload, match) {
    const query = [{
      $project: {
        text: 1,
        type: 1,
        status: 1,
        toUserId: 1,
        createdAt: 1
      }
    }, {
      $match: match
    }, {
      $sort: {
        createdAt: -1
      }
    }];
    const pagination = [{
      $skip: payload.pageNum ? (payload.pageNum - 1) * payload.limit : 0
    }, {
      $limit: payload.limit
    }];
    const aggregateQuery = this.aggregate([...query, ...pagination]);
    return {
      list: aggregateQuery,
      totalRecords: this.aggregate([...query])
    };
  }

}

_dbSchema.default.loadClass(NotificationClass);

var _default = _mongoose.default.model("Notifications", _dbSchema.default);

exports.default = _default;