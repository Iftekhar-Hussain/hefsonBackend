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
const messageSchema = new Schema({
  threadId: {
    type: String
  },
  type: {
    type: String,
    enum: ["one2one", "group"]
  },
  senderId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User"
  },
  receiverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  groupId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Groups",
    default: null
  },
  message: {
    type: String,
    default: ""
  }
}, {
  timestamps: true
});
var _default = messageSchema;
exports.default = _default;