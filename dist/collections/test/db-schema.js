"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */
const testSchema = new _mongoose.default.Schema({
  testingData: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});
var _default = testSchema;
exports.default = _default;