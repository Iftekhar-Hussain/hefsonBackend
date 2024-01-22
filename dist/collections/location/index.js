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
 * @description: It Contain function layer for Location collection.
 * @author: Ankit Kumar Gautam
 */
var ObjectId = require('mongodb').ObjectID;

class LocationClass {
  static saveLocation(payload) {
    return this(payload).save();
  }

}

_dbSchema.default.loadClass(LocationClass);

var _default = _mongoose.default.model('Location', _dbSchema.default);

exports.default = _default;