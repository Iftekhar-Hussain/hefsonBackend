"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireWildcard(require("mongoose"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for user collection.
 * @author: Ankit Kumar Gautam
 */
const userSchema = new _mongoose.default.Schema({
  email: {
    type: String,
    default: null
  },
  password: {
    type: String,
    default: null
  },
  mobile: {
    code: {
      type: String,
      default: "+1"
    },
    number: {
      type: String,
      default: 0
    }
  },
  phone: {
    type: Number,
    default: 0
  },
  emergencyPhone: {
    type: Number,
    default: 0
  },
  dob: {
    type: Date,
    default: null
  },
  //Hefson Id
  id: {
    type: String,
    default: ""
  },
  image: {
    type: String,
    default: ""
  },
  gender: {
    type: String,
    default: ""
  },
  fullName: {
    type: String,
    default: null
  },
  firstName: {
    type: String,
    default: null
  },
  lastName: {
    type: String,
    default: null
  },
  city: {
    type: String,
    default: null
  },
  state: {
    type: String,
    default: null
  },
  postalcode: {
    type: String,
    default: null
  },
  address: {
    type: String,
    default: ""
  },
  emailVerification: {
    type: String,
    default: ""
  },
  isEmailVerified: {
    type: Boolean,
    default: false
  },
  resetPasswordToken: {
    type: String,
    default: ""
  },

  /*
   * Define role for the user
   * 1 => ADMIN, 2 => CARRIER, 3 => BROKER, 4 => DRIVER, 5 => COMPANY
   */
  role: {
    type: Number,
    default: 4
  },
  deviceType: {
    type: String,
    default: ""
  },
  deviceId: {
    type: String,
    default: ""
  },
  loginToken: {
    type: String,
    default: ""
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  allowNotification: {
    type: Boolean,
    default: true
  },
  alertNotification: {
    type: Boolean,
    default: true
  },
  chatNotification: {
    type: Boolean,
    default: true
  },
  temperatureAlert: {
    type: Boolean,
    default: true
  },
  //Carrier
  businessName: {
    type: String,
    default: null
  },
  dotNumber: {
    type: String,
    default: null
  },
  dispatchName: {
    type: String,
    default: null
  },
  emergencyContact: {
    type: Number,
    default: 0
  },
  socketId: {
    type: String,
    default: null
  },
  lastSeen: {
    type: Date,
    default: null
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  carrierId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    default: null
  },
  sensorToken: {
    type: String,
    default: null
  },
  defaultTruck: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Trucks",
    default: null
  },
  defaultTrailer: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Trailers",
    default: null
  },
  defaultDriver: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "User",
    default: null
  }
}, {
  timestamps: true
});
var _default = userSchema;
exports.default = _default;