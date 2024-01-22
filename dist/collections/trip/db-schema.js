"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for trip collection.
 * @author: Ankit Kumar Gautam
 */
const tripSchema = new _mongoose.default.Schema({
  from: {
    type: String,
    default: ""
  },
  to: {
    type: String,
    default: ""
  },
  pickupDateTime: {
    type: Date,
    default: null
  },
  deliveryDateTime: {
    type: Date,
    default: null
  },
  lat: {
    type: String,
    default: null
  },
  long: {
    type: String,
    default: null
  },
  distance: {
    type: Number,
    default: 0
  },
  status: {
    type: Number,
    default: 1
    /* 1=>waiting 2=> pickup 3=> delivered */

  },
  load: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "loads"
  }],
  truckId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "trucks"
  },
  driverId: [{
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  }],
  brokerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  },
  expenseId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "expenses"
  }
}, {
  timestamps: true
});
var _default = tripSchema;
exports.default = _default;