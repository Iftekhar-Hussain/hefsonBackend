"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbSchema = _interopRequireDefault(require("./db-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It Contain function layer for message collection.
 * @author: Ankit Kumar Gautam
 */
class ChatGroupClass {
  static saveGroup(payload) {
    return this(payload).save();
  }

  static saveManyGroup(payload) {
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
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.id, updateData, {
      new: true
    });
  }

}

_dbSchema.default.loadClass(ChatGroupClass);

var _default = _mongoose.default.model("groups", _dbSchema.default);

exports.default = _default;