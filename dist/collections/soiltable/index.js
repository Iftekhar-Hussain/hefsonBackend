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
 * @description: It Contain function layer for soiltable collection.
 * @author: Ankit Kumar Gautam
 */
class SoiltableClass {
  static saveSoiltable(payload) {
    return this(payload).save();
  }

  static saveManySoiltable(payload) {
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

_dbSchema.default.loadClass(SoiltableClass);

var _default = _mongoose.default.model("Soiltables", _dbSchema.default);

exports.default = _default;