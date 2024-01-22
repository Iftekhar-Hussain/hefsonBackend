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
const qrcodeSchema = new _mongoose.default.Schema({
  soiltableId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Soiltables"
  },
  base64: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  companyId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  }
}, {
  timestamps: true
});
var _default = qrcodeSchema;
exports.default = _default;