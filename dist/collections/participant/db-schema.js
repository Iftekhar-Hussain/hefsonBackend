"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for chat collection.
 * @author: Aditi
 */
const participantSchema = new _mongoose.default.Schema({
  threadId: {
    type: String,
    default: null
  },
  type: {
    type: String,
    enum: ["one2one", "group"]
  },
  groupId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Groups",
    default: null
  },
  messageId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Messages"
  },
  senderId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users",
    required: true
  },
  receiverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users",
    default: null
  },
  lastMessageId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Messages"
  },
  lastMessage: {
    type: String,
    default: null
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isSender: {
    type: Boolean,
    default: false
  },
  isReceiver: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
var _default = participantSchema;
exports.default = _default;