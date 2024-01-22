"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for trailer collection.
 * @author: Ankit Kumar Gautam
 */
const requestCategorySchema = new _mongoose.default.Schema({
  name: {
    type: String,
    default: ""
  },
  userId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users"
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: false
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isApproved: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});
var _default = requestCategorySchema;
exports.default = _default;