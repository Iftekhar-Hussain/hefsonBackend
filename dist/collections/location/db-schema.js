"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for location collection.
 * @author: Ankit Kumar Gautam
 */
const locationSchema = new _mongoose.default.Schema({
  latitude: {
    type: Number,
    default: 0
  },
  longitude: {
    type: Number,
    default: 0
  },
  truckId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "trucks"
  },
  tripId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "trips"
  },
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  }
}, {
  timestamps: true
});
var _default = locationSchema;
exports.default = _default;