"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for terms collection.
 * @author: Ankit Kumar Gautam
 */
const termsSchema = new _mongoose.default.Schema({
  terms: {
    type: Array,
    default: null
  }
}, {
  timestamps: true
});
var _default = termsSchema;
exports.default = _default;