"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for load collection.
 * @author: Ankit Kumar Gautam
 */
const loadSchema = new _mongoose.default.Schema({
  items: [{
    name: {
      type: String,
      default: ""
    },
    price: {
      type: String,
      default: ""
    },
    category: {
      type: String,
      default: ""
    }
  }],
  temperature: {
    type: Number,
    default: 0
  },
  loadPrice: {
    /* is like revenue */
    type: Number,
    default: 0
  },
  loadIncome: {
    type: Number,
    default: 0
  },
  loadExpense: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "expenses"
  },
  pickupDateTime: {
    type: Date,
    default: null
  },
  deliveryDateTime: {
    type: Date,
    default: null
  },
  status: {
    type: Number,
    default: 1
    /* 1=>waiting 2=> pickup 3=> delivered */

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
var _default = loadSchema;
exports.default = _default;