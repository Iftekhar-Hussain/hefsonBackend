"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for notification collection.
 * @author: Ankit Kumar Gautam
 */
const notificationSchema = new _mongoose.default.Schema({
  text: {
    type: String,
    default: null
  },
  type: {
    type: String,
    default: null
  },
  senderId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User"
  },
  receiverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User"
  },
  trailerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Trailers",
    default: null
  },
  shipmentId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Shipments",
    default: null
  },
  truckId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Trucks",
    default: null
  },
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  latitude: {
    type: Number,
    default: null
  },
  longitude: {
    type: Number,
    default: null
  },
  temperature: {
    type: Number,
    default: null
  },
  isRead: {
    type: Boolean,
    default: false
  },
  isArchived: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
var _default = notificationSchema;
exports.default = _default;