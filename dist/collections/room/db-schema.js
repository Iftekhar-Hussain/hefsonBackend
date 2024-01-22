"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for room collection.
 * @author: Ankit Kumar Gautam
 */
const Schema = _mongoose.default.Schema;
const roomSchema = new Schema({
  participants: [{
    type: Schema.Types.ObjectId,
    ref: "User"
  }],
  type: {
    type: Number,
    default: 1
  },
  //1=> text, 2=> image
  status: {
    type: Number,
    default: 1
  },
  // 0=> inactive, 1=> active
  lastMessage: {
    type: String,
    default: ""
  },
  lastMessageBy: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User"
  },
  lastMessageDate: {
    type: Date,
    default: new Date()
  },
  unreadMessageCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
var _default = roomSchema;
exports.default = _default;