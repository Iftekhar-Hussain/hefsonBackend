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
const soiltableSchema = new _mongoose.default.Schema({
  name: {
    type: String,
    default: null
  },
  slug: {
    type: String,
    default: null
  },
  code: {
    type: String,
    default: null
  },
  categoryId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Categories"
  },
  theme: {
    type: String,
    default: "light"
  },
  origin: {
    type: String,
    default: null
  },
  isOrganic: {
    type: String,
    default: null
  },
  organicDescription: {
    type: String,
    default: null
  },
  transportationDays: {
    type: Number,
    default: 0
  },
  temperature: {
    type: String,
    default: null
  },
  calories: {
    type: String,
    default: null
  },
  water: {
    type: String,
    default: null
  },
  protien: {
    type: String,
    default: null
  },
  carbs: {
    type: String,
    default: null
  },
  sugar: {
    type: String,
    default: null
  },
  fiber: {
    type: String,
    default: null
  },
  fat: {
    type: String,
    default: null
  },
  storageInst: {
    type: String,
    default: null
  },
  customMessage: {
    type: String,
    default: null
  },
  image: {
    type: String,
    default: null
  },
  productImages: [{
    type: String
  }],
  timeline: [],
  productDetail: {
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
  companyId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "users"
  }
}, {
  timestamps: true
});
var _default = soiltableSchema;
exports.default = _default;