"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _extend = require("@hapi/joi/lib/extend");

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for soiltable collection.
 * @author: Ankit Kumar Gautam
 */
const stateSchema = new _mongoose.default.Schema({
  country: {
    type: String,
    default: null
  },
  state: [{
    name: {
      type: String,
      default: null
    }
  }],
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
var _default = stateSchema;
exports.default = _default;