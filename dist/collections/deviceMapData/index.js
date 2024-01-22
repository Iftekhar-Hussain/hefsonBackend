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
 * @description: It Contain function layer for Shipment collection.
 * @author: Ankit Kumar Gautam
 */
class DeviceMapDataClass {
  static saveDeviceMapData(payload) {
    return this(payload).save();
  }

  static saveManyDeviceMapData(payload) {
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
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.id, updateData, {
      new: true
    });
  }

}

_dbSchema.default.loadClass(DeviceMapDataClass);

var _default = _mongoose.default.model("deviceMapDatas", _dbSchema.default);

exports.default = _default;