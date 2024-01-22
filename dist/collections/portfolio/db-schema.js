"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for portfolio collection.
 * @author: Ankit Kumar Gautam
 */
const portfolioSchema = new _mongoose.default.Schema({
  licenseNo: {
    type: String,
    default: ""
  },
  licenseExp: {
    type: Date,
    default: ""
  },
  issuedState: {
    type: String,
    default: ""
  },
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User"
  },
  totalMiles: {
    type: Number,
    default: 0
  },
  totalShipment: {
    type: Number,
    default: 0
  },
  totalPay: {
    type: Number,
    default: 0
  },
  incidentCount: [{
    incidnentName: {
      type: String,
      default: ""
    },
    incidentDate: {
      type: Date,
      default: null
    },
    incidentDescriptiion: {
      type: String,
      default: ""
    }
  }],
  ownerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User"
  }
}, {
  timestamps: true
});
var _default = portfolioSchema;
exports.default = _default;