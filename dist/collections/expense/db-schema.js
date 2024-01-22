"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for expense collection.
 * @author: Ankit Kumar Gautam
 */
const expenseSchema = new _mongoose.default.Schema({
  date: {
    type: String,
    default: null
  },
  item: [{
    name: {
      type: String,
      default: ""
    },
    price: {
      type: String,
      default: ""
    }
  }],
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  },
  tripId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "trips"
  },
  truckId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "trucks"
  }
}, {
  timestamps: true
});
var _default = expenseSchema;
exports.default = _default;