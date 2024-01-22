"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _boolean = _interopRequireDefault(require("@hapi/joi/lib/types/boolean"));

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for manufacture collection.
 * @author: Ankit Kumar Gautam
 */
const manufactureSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    default: ""
  },
  feature: [{
    color: {
      type: String,
      default: ""
    },
    image: {
      type: String,
      default: null
    }
  }],
  image: {
    type: String,
    default: null
  },
  type: {
    type: Number,
    default: null
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});
var _default = manufactureSchema;
exports.default = _default;