"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for unit collection.
 * @author: Ankit Kumar Gautam
 */
const unitSchema = new _mongoose.default.Schema({
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
  from: {
    type: String,
    default: ""
  },
  to: {
    type: String,
    default: ""
  },
  unitRevenue: {
    type: Number,
    default: 0
  },
  unitIncome: {
    type: Number,
    default: 0
  },
  unitExpense: {
    type: Number,
    default: 0
  },
  pickupDateTime: {
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
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  }
}, {
  timestamps: true
});
var _default = unitSchema;
exports.default = _default;