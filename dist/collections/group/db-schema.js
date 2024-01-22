"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for message collection.
 * @author: Ankit Kumar Gautam
 */
const Schema = _mongoose.default.Schema;
const participant = new _mongoose.default.Schema({
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users"
  }
});
const groupSchema = new Schema({
  name: {
    type: String,
    default: null
  },
  createdBy: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users"
  },
  users: [participant]
}, {
  timestamps: true
});
var _default = groupSchema;
exports.default = _default;