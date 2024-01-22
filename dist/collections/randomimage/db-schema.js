"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for randomimage collection.
 * @author: Ankit Kumar Gautam
 */
const randomimageSchema = new _mongoose.default.Schema({
  randomTime: {
    type: Date,
    default: null
  },
  imageLink: {
    type: String,
    default: ""
  },
  category: {
    type: String,
    enum: ["dashboard", "trailer", "sensor"]
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
var _default = randomimageSchema;
exports.default = _default;