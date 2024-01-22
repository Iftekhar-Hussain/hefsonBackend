"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: db-schema.js
 * @description: It Contain db schema for shipment collection.
 * @author: Ankit Kumar Gautam
 */
const shipmentSchema = new _mongoose.default.Schema({
  loadId: {
    type: String,
    default: null
  },
  truckId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Trucks"
  },
  trailerId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Trailers"
  },
  driverId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users"
  },
  startTime: {
    type: Number,
    default: 0
  },
  startOffset: {
    type: Number,
    default: 0
  },
  endTime: {
    type: Number,
    default: 0
  },
  endOffset: {
    type: Number,
    default: 0
  },
  shipper: [{
    id: {
      type: Number,
      default: 0
    },
    pickupName: {
      type: String,
      default: null
    },
    pickupAddress: {
      type: String,
      default: null
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    pickupDate: {
      type: String,
      default: null
    },
    pickupTime: {
      type: String,
      default: null
    },
    poNumber: {
      type: String,
      default: null
    },
    offset: {
      type: Number,
      default: 0
    },
    timeZone: {
      type: String,
      default: null
    },
    utcDate: {
      type: Date,
      default: null
    }
  }],
  receiver: [{
    id: {
      type: Number,
      default: 0
    },
    deliveryName: {
      type: String,
      default: null
    },
    deliveryAddress: {
      type: String,
      default: null
    },
    latitude: {
      type: Number
    },
    longitude: {
      type: Number
    },
    deliveryDate: {
      type: String,
      default: null
    },
    deliveryTime: {
      type: String,
      default: null
    },
    deliveryNumber: {
      type: String,
      default: null
    },
    offset: {
      type: Number,
      default: 0
    },
    timeZone: {
      type: String,
      default: null
    },
    utcDate: {
      type: Date,
      default: null
    }
  }],
  temperature: {
    actual: {
      type: String,
      default: null
    },
    min: {
      type: String,
      default: null
    },
    max: {
      type: String,
      default: null
    }
  },
  referenceNumber: {
    type: String,
    default: null
  },
  comment: {
    type: String,
    default: null
  },
  broker: {
    name: {
      type: String,
      default: null
    },
    brokerAgent: {
      type: String,
      default: null
    },
    brokerPhone: {
      type: Number,
      default: null
    },
    brokerhefsonId: {
      type: String,
      default: null
    }
  },
  carrierId: {
    type: _mongoose.default.Schema.Types.ObjectId,
    ref: "Users"
  },
  dispatchName: {
    type: String,
    default: null
  },
  totalDistance: {
    type: Number,
    default: null
  },
  totalHours: {
    type: Number,
    default: null
  },
  carrierPhone: {
    type: Number,
    default: null
  },
  carrierEmergencyPhone: {
    type: Number,
    default: null
  },
  isCompleted: {
    type: Boolean,
    default: false
  },
  isCancelled: {
    type: Boolean,
    default: false
  },
  isStart: {
    type: Boolean,
    default: false
  },
  isActive: {
    type: Boolean,
    default: true
  },
  isDeleted: {
    type: Boolean,
    default: false
  },
  isShipperArrival: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  // isShipperCheckIn: {
  //   status:{
  //     type:Boolean,
  //     default:false
  //   },
  //   createdTime: {
  //     type:Date,
  //     default:null
  //   }
  // },
  isShipperWaiting: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isShipperLoading: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isShipperLoadingComplete: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isShipperCheckout: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isShipperDeparture: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isReceiverArrival: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  // isReceiverCheckin: {
  //   status:{
  //     type:Boolean,
  //     default:false
  //   },
  //   createdTime: {
  //     type:Date,
  //     default:null
  //   }
  // },
  isReceiverWaiting: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isReceiverUnloading: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isReceiverUnLoadingComplete: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isReceiverCheckout: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  isReceiverDeparture: {
    status: {
      type: Boolean,
      default: false
    },
    createdTime: {
      type: Date,
      default: null
    },
    latitude: {
      type: Number,
      default: null
    },
    longitude: {
      type: Number,
      default: null
    }
  },
  tempAlertCount: {
    type: Number,
    default: 0
  }
}, {
  timestamps: true
});
var _default = shipmentSchema;
exports.default = _default;