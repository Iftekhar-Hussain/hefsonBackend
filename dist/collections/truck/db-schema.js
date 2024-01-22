"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for truck collection.
 * @author: Ankit Kumar Gautam
 */
const truckSchema = new _mongoose.default.Schema({
  unitNumber: {
    type: String,
    default: ""
  },
  modelYear: {
    type: Date,
    default: null
  },
  numberPlate: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  manufacture: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Manufactures",
    required: true
  },
  truckColor: {
    type: _mongoose.default.Schema.Types.ObjectId,
    default: null
  },
  registrationExpiry: {
    type: Date,
    default: null
  },
  carrierId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    required: true
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
var _default = truckSchema;
exports.default = _default;