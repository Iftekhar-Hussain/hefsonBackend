"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.shareLink = exports.downloadxls = exports.listAlarm = exports.listInactiveShipment = exports.listActiveShipment = exports.deleteShipment = exports.updateStatus = exports.updateShipment = exports.completeShipmentDetail = exports.detailShipment = exports.listShipment = exports.addShipment = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _shipment = _interopRequireDefault(require("../collections/shipment"));

var _user = _interopRequireDefault(require("../collections/user"));

var _trailer = _interopRequireDefault(require("../collections/trailer"));

var _history = _interopRequireDefault(require("../collections/history"));

var _sensor = _interopRequireDefault(require("../collections/sensor"));

var _alarm = _interopRequireDefault(require("../collections/alarm"));

var _universal = require("../utilities/universal");

var _config = _interopRequireDefault(require("config"));

var Mail = _interopRequireWildcard(require("../utilities/mail"));

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: shipment.js
 * @description: It Contain function layer for shipment service.
 * @author: Ankit Kumar Gautam
 */
const {
  frontendUrl,
  twillio,
  SEND_GRID_KEY,
  logoUrl,
  Stripe_Publishable_key,
  Stripe_Secret_key
} = _config.default.get("app");

const writeXlsxFile = require("write-excel-file/node");

var xl = require("excel4node");

/**
 *
 * @param {*} payload
 * @description - save shipment to db
 */

/********** Save shipment **********/
const getLocationAsync = (lat, lng, timestamp) => {
  return new Promise((resolve, reject) => {
    (0, _universal.getOffsetFromAddress)(lat, lng, timestamp, location => {
      if (location) {
        resolve(location);
      } else {
        reject(new Error("Failed to get location"));
      }
    });
  });
};

const calculateTimeInUTC = async (date, time, latitude, longitude) => {
  // convert using Asia/ kolkatta timestamp to get the timezone on the basis of lat & long
  let actualTime = (0, _universal.dateConvertTimeStamp)(date, time);
  var lat = latitude,
      lng = longitude;
  var timestamp1 = parseInt(_moment.default.utc(actualTime).valueOf() / 1000);
  const fakelocation = await getLocationAsync(lat, lng, timestamp1); // get actual time

  let gg = (0, _universal.convertToActualDate)(date, time, fakelocation.timeZoneId);
  actualTime = parseInt(_moment.default.utc(gg).valueOf() / 1000);
  return {
    time: actualTime,
    offset: fakelocation.rawOffset,
    utcDate: gg,
    timezoneId: fakelocation.timeZoneId
  };
};

const addShipment = async payload => {
  let trailerExist = await _shipment.default.findOne({
    trailerId: payload.trailerId,
    isCompleted: false,
    isCancelled: false //  $or: [{ isCompleted: false , isCancelled:true}],

  });

  if (trailerExist) {
    return {
      status: 400,
      message: "trailer"
    };
  }

  let truckExist = await _shipment.default.findOne({
    truckId: payload.trailerId,
    $or: [{
      isCompleted: false
    }, {
      isDeleted: false
    }, {
      isCancelled: false
    }]
  });

  if (truckExist) {
    return {
      status: 400,
      message: "truck"
    };
  }

  let trailerData = await _trailer.default.findOne({
    _id: _mongoose.default.Types.ObjectId(payload.trailerId)
  });
  let sensorData = await _sensor.default.findOne({
    _id: _mongoose.default.Types.ObjectId(trailerData.sensorId)
  });
  let startTime = await calculateTimeInUTC(payload.shipper[0].pickupDate, payload.shipper[0].pickupTime, payload.shipper[0].latitude, payload.shipper[0].longitude);
  payload.startTime = startTime.time;
  payload.startOffset = startTime.offset;
  let endTime = await calculateTimeInUTC(payload.receiver[0].deliveryDate, payload.receiver[0].deliveryTime, payload.receiver[0].latitude, payload.receiver[0].longitude);
  payload.endTime = endTime.time;
  payload.endOffset = endTime.offset;

  for (let i = 0; i < payload.shipper.length; i++) {
    let shipperTimeCal = await calculateTimeInUTC(payload.shipper[i].pickupDate, payload.shipper[i].pickupTime, payload.shipper[i].latitude, payload.shipper[i].longitude);
    payload.shipper[i].offset = shipperTimeCal.offset;
    payload.shipper[i].timeZone = shipperTimeCal.timezoneId;
    payload.shipper[i].utcDate = shipperTimeCal.utcDate;
  }

  for (let j = 0; j < payload.shipper.length; j++) {
    let receiverTimeCal = await calculateTimeInUTC(payload.receiver[j].deliveryDate, payload.receiver[j].deliveryTime, payload.receiver[j].latitude, payload.receiver[j].longitude);
    payload.receiver[j].offset = receiverTimeCal.offset;
    payload.receiver[j].timeZone = receiverTimeCal.timezoneId;
    payload.receiver[j].utcDate = receiverTimeCal.utcDate;
  }

  payload.loadId = "LO" + (0, _universal.generateRandom)(5, false);
  let userObj = {};

  if (payload.isDefaultTruck) {
    userObj.defaultTruck = payload.truckId;
  }

  if (payload.isDefaultTrailer) {
    userObj.defaultTrailer = payload.trailerId;
  }

  if (payload.isDefaultDriver) {
    userObj.defaultDriver = payload.driverId;
  }

  payload.totalDistance = await (0, _universal.getDistance)(payload.shipper[0].latitude, payload.shipper[0].longitude, payload.receiver[0].latitude, payload.receiver[0].longitude);
  let dt1 = payload.shipper[0].pickupDate + " " + payload.shipper[0].pickupTime;
  let dt2 = payload.receiver[0].deliveryDate + " " + payload.receiver[0].deliveryTime;
  payload.totalHours = (0, _universal.diff_hours)(new Date(dt1), new Date(dt2));
  await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.carrierId)
  }, {
    $set: userObj
  });
  let trailerInfo = await _trailer.default.findOne({
    _id: _mongoose.default.Types.ObjectId(payload.trailerId)
  });
  let currentHours = parseInt(trailerInfo.currentHours) + parseInt(payload.totalHours);
  let totalTrailerHours = parseInt(trailerInfo.engineHours) + parseInt(payload.totalHours);
  await _trailer.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.trailerId)
  }, {
    $set: {
      currentHours: currentHours,
      engineHours: totalTrailerHours
    }
  });
  let saveData = await _shipment.default.saveShipment(payload);
  let sensorToken = "";
  let userData = await _user.default.findOne({
    role: 1
  });
  sensorToken = userData.sensorToken;
  let options = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/Instruction",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "CommandInstruction",
      FAssetGUID: sensorData.FAssetGUID,
      //"fbfc256e-7225-4b97-b297-edf55ccecb15", //shipmentIds,
      FInsType: "BASE48",
      FOffline: "1",
      FT_BASE48Ins: {
        FOperationType: 3,
        FAssetID: sensorData.FAssetID,
        //"835210000201",
        FHighTempAlarm: 1,
        FLowTempAlarm: 1,
        FHighHumidityAlarm: 1,
        FLowHumidityAlarm: 1
      }
    }
  });
  console.log("base48", options.data);
  let options1 = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/Instruction",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "CommandInstruction",
      FAssetGUID: sensorData.FAssetGUID,
      //"fbfc256e-7225-4b97-b297-edf55ccecb15", //shipmentIds,
      FInsType: "BASE78",
      FOffline: "1",
      FT_BASE78Ins: {
        FOperationType: 3,
        FAssetID: sensorData.FAssetID,
        //"835210000201",
        FValue: 1,
        FTime: 10,
        FExceptionTime: 60
      }
    }
  });
  console.log("base78", options1.data);
  let options2 = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/Instruction",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "CommandInstruction",
      FAssetGUID: sensorData.FAssetGUID,
      //"fbfc256e-7225-4b97-b297-edf55ccecb15", //shipmentIds,
      FInsType: "BASE59",
      FOffline: "1",
      FT_BASE59Ins: {
        FOperationType: 3,
        FType: 1,
        FLowThreshold: parseInt(payload.temperature.min),
        FHighThreshold: parseInt(payload.temperature.max)
      }
    }
  });
  let options3 = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/Instruction",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "CommandInstruction",
      FAssetGUID: sensorData.FAssetGUID,
      //"fbfc256e-7225-4b97-b297-edf55ccecb15", //shipmentIds,
      FInsType: "BASE59",
      FOffline: "1",
      FT_BASE59Ins: {
        FOperationType: 3,
        FType: 3,
        FLowThreshold: 10,
        FHighThreshold: 140
      }
    }
  });
  console.log("base59", options2.data);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - list of shipment
 */


exports.addShipment = addShipment;

const listShipment = async (user, payload) => {
  let query = {
    isDeleted: false
  };

  if (payload.status == undefined || payload.status == "" || payload.status == "active") {
    query = { ...query,
      isCompleted: false,
      isCancelled: false
    };
  }

  if (payload.status == "complete") {
    query = { ...query,
      isCompleted: true
    };
  }

  if (payload.status == "cancel") {
    query = { ...query,
      isCancelled: true
    };
  }

  let sensorToken = "";

  if (user.role != 1) {
    let userData = await _user.default.findOne({
      role: 1
    });
    sensorToken = userData.sensorToken;
    query = { ...query,
      carrierId: _mongoose.default.Types.ObjectId(user.userId)
    };
  } else {
    sensorToken = user.sensorToken;
  }

  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;

  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = { ...query,
      $or: [{
        loadId: {
          $regex: regex
        }
      }, {
        unitNumber: {
          $regex: regex
        }
      }, {
        trailerNumber: {
          $regex: regex
        }
      }, {
        driverName: {
          $regex: regex
        }
      }, {
        broker: {
          $regex: regex
        }
      }, {
        brokerAgent: {
          $regex: regex
        }
      }]
    };
  }

  var data = await _shipment.default.listShipment(user, payload, query, sortBy, sortValue);
  let finalData = await data.list;
  const totalRecords = await data.totalRecords;
  let sensorIds = finalData.map(function (e) {
    return e.sensorData.FGUID;
  }).join(",");
  let options = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "QueryLBSMonitorListByFGUIDs",
      FGUIDs: sensorIds,
      FType: 1
    }
  }); // await Promise.all();

  finalData = await Promise.all(finalData.map(async (k, index) => {
    let obj = { ...k
    }; //console.log('obj',obj)

    let FobjectIndex = options.data.FObject.findIndex(itm => itm.FAssetID == obj.sensorData.FAssetID);
    let tempInF = options.data.FObject[FobjectIndex].FTemperature1 * 9 / 5 + 32;
    options.data.FObject[FobjectIndex].FTemperature1 = tempInF;

    if (FobjectIndex != -1) {
      obj["realTimeData"] = options.data.FObject[FobjectIndex];
    } else {
      obj["realTimeData"] = {};
    }

    if (obj.isStart == true) {
      obj["coveredHours"] = await (0, _universal.getDistance)(obj.shipper[0].latitude, obj.shipper[0].longitude, options.data.FObject[FobjectIndex].FLatitude, options.data.FObject[FobjectIndex].FLongitude);
    } else {
      obj["coveredHours"] = 0;
    }

    return obj;
  }));
  return {
    list: finalData,
    total: totalRecords.length // limit: payload["limit"] ? payload["limit"] : 10,

  };
};
/**
 *
 * @param {*} payload
 * @description - detail of shipment
 */


exports.listShipment = listShipment;

const detailShipment = async (user, payload) => {
  let shipmaentId = payload.id;
  let query = {
    _id: _mongoose.default.Types.ObjectId(shipmaentId),
    isActive: true,
    isDeleted: false
  };
  var data = await _shipment.default.detailShipment(payload, query);
  let sensorToken = ""; //if (user.role != 1) {

  let userData = await _user.default.findOne({
    role: 1
  });
  sensorToken = userData.sensorToken; // } else {
  //   sensorToken = user.sensorToken;
  // }

  let options = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "QueryLBSMonitorListByFGUIDs",
      FGUIDs: data[0].sensorData.FGUID,
      FType: 1
    }
  });
  let tempInF = options.data.FObject[0].FTemperature1 * 9 / 5 + 32;
  options.data.FObject[0].FTemperature1 = tempInF;
  data[0].realTimeData = options.data.FObject[0];

  if (data[0].isStart == true) {
    data[0].coveredHours = await (0, _universal.getDistance)(data[0].shipper[0].latitude, data[0].shipper[0].longitude, options.data.FObject[0].FLatitude, options.data.FObject[0].FLongitude);
    console.log("data[0].coveredHours", data[0].coveredHours);
  } else {
    data[0].coveredHours = 0;
  }

  data[0].leftDistancePercentage = ((data[0].totalDistance - data[0].coveredHours) / data[0].totalDistance * 100).toFixed(2);

  let currentTimeStamp = _moment.default.utc().valueOf();

  let dt1 = parseInt(currentTimeStamp) / 1000;
  let endTime = await calculateTimeInUTC(data[0].receiver[0].deliveryDate, data[0].receiver[0].deliveryTime, data[0].receiver[0].latitude, data[0].receiver[0].longitude);
  let dt2 = endTime.time;
  let letTime = (dt2 - dt1) * 0.000277778;
  data[0].leftTime = letTime.toFixed(2);
  let shipperTimeCal = await calculateTimeInUTC(data[0].shipper[0].pickupDate, data[0].shipper[0].pickupTime, data[0].shipper[0].latitude, data[0].shipper[0].longitude);
  console.log("shipperTimeCal.utcDate", shipperTimeCal.utcDate);
  console.log("shipperTimeCal.endTime", endTime.utcDate); // let options1 = await axios({
  //   method: "post",
  //   url: "http://icloud.assetscontrols.com:8092/OpenApi/Report",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: {
  //     FTokenID: sensorToken,
  //     FAction: "QueryMessageAlarmList",
  //     FGUIDs: data[0].sensorData.FGUID,
  //     FSelectType: 1,
  //     FStartTime: shipperTimeCal.utcDate, //"2023-07-01 15:59:59",
  //     FEndTime: endTime.utcDate, //"2023-07-19 15:59:59",
  //     FDataTypes: "63",
  //     FDateType: 1,
  //   },
  // });

  data[0].tempAlertCount = await _alarm.default.count({
    shipmentId: _mongoose.default.Types.ObjectId(shipmaentId),
    type: 1
  }); //options1.data.FObject.length;
  // let options2 = await axios({
  //   method: "post",
  //   url: "http://icloud.assetscontrols.com:8092/OpenApi/Report",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: {
  //     FTokenID: sensorToken,
  //     FAction: "QueryMessageAlarmList",
  //     FGUIDs: data[0].sensorData.FGUID,
  //     FSelectType: 1,
  //     FStartTime: shipperTimeCal.utcDate, //"2023-07-01 15:59:59",
  //     FEndTime: endTime.utcDate, //"2023-07-19 15:59:59",
  //     FDataTypes: "316",
  //     FDateType: 1,
  //   },
  // });

  data[0].doorAlertCount = await _alarm.default.count({
    shipmentId: _mongoose.default.Types.ObjectId(shipmaentId),
    type: 2
  }); //options2.data.FObject.length;
  // payload.endOffset = endTime.offset;
  // let dt1 = moment().format("YYYY-MM-DD") + " " + moment().format("HH:mm");
  // let dt2 =
  //   data[0].receiver[0].deliveryDate + " " + data[0].receiver[0].deliveryTime;
  // data[0].leftTime = diff_hours(new Date(dt1), new Date(dt2));
  //   console.log('dt1',dt1)
  //   console.log('dt2',dt2)
  // console.log('data[0].leftTime',new Date())
  // let ndt1 = "2023-05-24 16:00:00"; //d.shipper[0].pickupDate + " " + d.shipper[0].pickupTime;
  //dt1 = moment().utc(dt1);
  //console.log(sensorToken,'ffff')
  // let ndt2 =
  //   moment().utc().format("YYYY-MM-DD") +
  //   " " +
  //   moment().utc().format("HH:mm:ss"); //data[0].receiver[0].deliveryDate + " " + data[0].receiver[0].deliveryTime;
  // // console.log(dt2);
  // let options1 = await axios({
  //   method: "post",
  //   url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: {
  //     FTokenID: sensorToken,
  //     FAction: "QueryLBSTrackListByFGUID",
  //     FGUID: data[0].sensorData.FGUID,
  //     FType: 1,
  //     FAssetTypeID: data[0].realTimeData.FAssetTypeID,
  //     FStartTime: ndt1,
  //     FEndTime: ndt2,
  //     // FLanguage: 0,
  //     FDateType: 1,
  //   },
  // });
  // data[0].historyData = options1.data.FObject;
  // data[0].tempAlertCount = await ALARMMODEL.count({
  //   shipmentId: mongoose.Types.ObjectId(shipmaentId),
  //   type: 1,
  // });
  // data[0].doorAlertCount = await ALARMMODEL.count({
  //   shipmentId: mongoose.Types.ObjectId(shipmaentId),
  //   type: 2,
  // });

  return data[0];
};

exports.detailShipment = detailShipment;

const completeShipmentDetail = async (user, payload) => {
  let shipmaentId = payload.id;
  let query = {
    _id: _mongoose.default.Types.ObjectId(shipmaentId),
    isActive: true,
    isDeleted: false
  };
  var data = await _shipment.default.detailShipment(payload, query);
  data[0].coveredHours = data[0].totalHours;
  data[0].leftDistancePercentage = ((data[0].totalDistance - data[0].coveredHours) / data[0].totalDistance * 100).toFixed(2);
  let dt1 = (0, _moment.default)().format("YYYY-MM-DD") + " " + (0, _moment.default)().format("HH:mm");
  let dt2 = data[0].receiver[0].deliveryDate + " " + data[0].receiver[0].deliveryTime;
  data[0].leftTime = (0, _universal.diff_hours)(new Date(dt1), new Date(dt2));
  return data[0];
};
/**
 *
 * @param {*}
 * @description - update details of shipment
 */


exports.completeShipmentDetail = completeShipmentDetail;

const updateShipment = async payload => {
  //return await SHIPMENTMODEL.updateShipment(payload);
  let trailerExist = await _shipment.default.findOne({
    _id: {
      $ne: _mongoose.default.Types.ObjectId(payload.id)
    },
    trailerId: payload.trailerId,
    $and: [{
      isCompleted: false
    }, {
      isCancelled: false
    }]
  });
  console.log("trailerExist", trailerExist);

  if (trailerExist) {
    return {
      status: 400,
      message: "trailer"
    };
  } //return false


  let truckExist = await _shipment.default.findOne({
    _id: {
      $ne: _mongoose.default.Types.ObjectId(payload.id)
    },
    truckId: payload.trailerId,
    $and: [{
      isCompleted: false
    }, {
      isDeleted: false
    }, {
      isCancelled: false
    }]
  });

  if (truckExist) {
    return {
      status: 400,
      message: "truck"
    };
  }

  let trailerData = await _trailer.default.findOne({
    _id: _mongoose.default.Types.ObjectId(payload.trailerId)
  });
  let sensorData = await _sensor.default.findOne({
    _id: _mongoose.default.Types.ObjectId(trailerData.sensorId)
  });
  let startTime = await calculateTimeInUTC(payload.shipper[0].pickupDate, payload.shipper[0].pickupTime, payload.shipper[0].latitude, payload.shipper[0].longitude);
  payload.startTime = startTime.time;
  payload.startOffset = startTime.offset;
  let endTime = await calculateTimeInUTC(payload.receiver[0].deliveryDate, payload.receiver[0].deliveryTime, payload.receiver[0].latitude, payload.receiver[0].longitude);
  payload.endTime = endTime.time;
  payload.endOffset = endTime.offset;

  for (let i = 0; i < payload.shipper.length; i++) {
    let shipperTimeCal = await calculateTimeInUTC(payload.shipper[i].pickupDate, payload.shipper[i].pickupTime, payload.shipper[i].latitude, payload.shipper[i].longitude);
    payload.shipper[i].offset = shipperTimeCal.offset;
    payload.shipper[i].timeZone = shipperTimeCal.timezoneId;
    payload.shipper[i].utcDate = shipperTimeCal.utcDate;
  }

  for (let j = 0; j < payload.shipper.length; j++) {
    let receiverTimeCal = await calculateTimeInUTC(payload.receiver[j].deliveryDate, payload.receiver[j].deliveryTime, payload.receiver[j].latitude, payload.receiver[j].longitude);
    payload.receiver[j].offset = receiverTimeCal.offset;
    payload.receiver[j].timeZone = receiverTimeCal.timezoneId;
    payload.receiver[j].utcDate = receiverTimeCal.utcDate;
  } // payload.loadId = "LO" + generateRandom(5, false);


  let userObj = {};

  if (payload.isDefaultTruck) {
    userObj.defaultTruck = payload.truckId;
  }

  if (payload.isDefaultTrailer) {
    userObj.defaultTrailer = payload.trailerId;
  }

  if (payload.isDefaultDriver) {
    userObj.defaultDriver = payload.driverId;
  }

  payload.totalDistance = await (0, _universal.getDistance)(payload.shipper[0].latitude, payload.shipper[0].longitude, payload.receiver[0].latitude, payload.receiver[0].longitude);
  let dt1 = payload.shipper[0].pickupDate + " " + payload.shipper[0].pickupTime;
  let dt2 = payload.receiver[0].deliveryDate + " " + payload.receiver[0].deliveryTime;
  payload.totalHours = (0, _universal.diff_hours)(new Date(dt1), new Date(dt2));
  await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.carrierId)
  }, {
    $set: userObj
  });
  let sensorToken = "";
  let userData = await _user.default.findOne({
    role: 1
  });
  sensorToken = userData.sensorToken;
  let options2 = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/Instruction",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "CommandInstruction",
      FAssetGUID: sensorData.FAssetGUID,
      //"fbfc256e-7225-4b97-b297-edf55ccecb15", //shipmentIds,
      FInsType: "BASE59",
      FOffline: "1",
      FT_BASE59Ins: {
        FOperationType: 3,
        FType: 1,
        FLowThreshold: parseInt(payload.temperature.min),
        FHighThreshold: parseInt(payload.temperature.max)
      }
    }
  });
  return await _shipment.default.updateShipment(payload);
};

exports.updateShipment = updateShipment;

const updateStatus = async payload => {
  let setData;
  let userData = await _user.default.findOne({
    role: 1
  });
  let sensorToken = userData.sensorToken;
  let match = {
    _id: _mongoose.default.Types.ObjectId(payload.id)
  };
  const query = [{
    $match: match
  }, {
    $lookup: {
      from: "trailers",
      localField: "trailerId",
      foreignField: "_id",
      as: "trailerData"
    }
  }, {
    $unwind: "$trailerData"
  }, {
    $lookup: {
      from: "sensors",
      localField: "trailerData.sensorId",
      foreignField: "_id",
      as: "sensorData"
    }
  }, {
    $unwind: "$sensorData"
  }];
  let shipmets = await _shipment.default.aggregate(query);
  let options = await (0, _axios.default)({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
    headers: {
      "Content-Type": "application/json"
    },
    data: {
      FTokenID: sensorToken,
      FAction: "QueryLBSMonitorListByFGUIDs",
      FGUIDs: shipmets[0].sensorData.FGUID,
      FType: 1
    }
  });

  if (payload.status == "complete") {
    // let traileInfo = await TRAILERMODEL.findOne({
    //   _id: mongoose.Types.ObjectId(shipmets[0].trailerId),
    // });
    // let updatedHours = traileInfo.currentHours + shipmets[0].totalHours;
    // await TRAILERMODEL.update(
    //   { _id: mongoose.Types.ObjectId(shipmets[0].trailerId) },
    //   {
    //     $set: {
    //       currentHours: updatedHours,
    //     },
    //   }
    // );
    setData = { ...setData,
      isCompleted: true
    };

    if (shipmets[0].isShipperArrival.status == false) {
      setData = { ...setData,
        "isShipperArrival.status": true,
        "isShipperArrival.createdTime": options.data.FObject[0].FGPSTime,
        "isShipperArrival.latitude": options.data.FObject[0].FLatitude,
        "isShipperArrival.longitude": options.data.FObject[0].FLongitude
      };
    } // if (shipmets[0].isShipperCheckIn.status == false) {
    //   setData = {
    //     ...setData,
    //     "isShipperCheckIn.status": true,
    //     "isShipperCheckIn.createdTime": options.data.FObject[0].FGPSTime,
    //   };
    // }


    if (shipmets[0].isShipperWaiting.status == false) {
      setData = { ...setData,
        "isShipperWaiting.status": true,
        "isShipperWaiting.createdTime": options.data.FObject[0].FGPSTime,
        "isShipperWaiting.latitude": options.data.FObject[0].FLatitude,
        "isShipperWaiting.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isShipperLoading.status == false) {
      setData = { ...setData,
        "isShipperLoading.status": true,
        "isShipperLoading.createdTime": options.data.FObject[0].FGPSTime,
        "isShipperLoading.latitude": options.data.FObject[0].FLatitude,
        "isShipperLoading.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isShipperLoadingComplete.status == false) {
      setData = { ...setData,
        "isShipperLoadingComplete.status": true,
        "isShipperLoadingComplete.createdTime": options.data.FObject[0].FGPSTime,
        "isShipperLoadingComplete.latitude": options.data.FObject[0].FLatitude,
        "isShipperLoadingComplete.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isShipperCheckout.status == false) {
      setData = { ...setData,
        "isShipperCheckout.status": true,
        "isShipperCheckout.createdTime": options.data.FObject[0].FGPSTime,
        "isShipperCheckout.latitude": options.data.FObject[0].FLatitude,
        "isShipperCheckout.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isShipperDeparture.status == false) {
      setData = { ...setData,
        "isShipperDeparture.status": true,
        "isShipperDeparture.createdTime": options.data.FObject[0].FGPSTime,
        "isShipperDeparture.latitude": options.data.FObject[0].FLatitude,
        "isShipperDeparture.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isReceiverArrival.status == false) {
      setData = { ...setData,
        "isReceiverArrival.status": true,
        "isReceiverArrival.createdTime": options.data.FObject[0].FGPSTime,
        "isReceiverArrival.latitude": options.data.FObject[0].FLatitude,
        "isReceiverArrival.longitude": options.data.FObject[0].FLongitude
      };
    } // if (shipmets[0].isReceiverCheckin.status == false) {
    //   setData = {
    //     ...setData,
    //     "isReceiverCheckin.status": true,
    //     "isReceiverCheckin.createdTime": options.data.FObject[0].FGPSTime,
    //   };
    // }


    if (shipmets[0].isReceiverWaiting.status == false) {
      setData = { ...setData,
        "isReceiverWaiting.status": true,
        "isReceiverWaiting.createdTime": options.data.FObject[0].FGPSTime,
        "isReceiverWaiting.latitude": options.data.FObject[0].FLatitude,
        "isReceiverWaiting.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isReceiverUnloading.status == false) {
      setData = { ...setData,
        "isReceiverUnloading.status": true,
        "isReceiverUnloading.createdTime": options.data.FObject[0].FGPSTime,
        "isReceiverUnloading.latitude": options.data.FObject[0].FLatitude,
        "isReceiverUnloading.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isReceiverUnLoadingComplete.status == false) {
      setData = { ...setData,
        "isReceiverUnLoadingComplete.status": true,
        "isReceiverUnLoadingComplete.createdTime": options.data.FObject[0].FGPSTime,
        "isReceiverUnLoadingComplete.latitude": options.data.FObject[0].FLatitude,
        "isReceiverUnLoadingComplete.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isReceiverCheckout.status == false) {
      setData = { ...setData,
        "isReceiverCheckout.status": true,
        "isReceiverCheckout.createdTime": options.data.FObject[0].FGPSTime,
        "isReceiverCheckout.latitude": options.data.FObject[0].FLatitude,
        "isReceiverCheckout.longitude": options.data.FObject[0].FLongitude
      };
    }

    if (shipmets[0].isReceiverDeparture.status == false) {
      setData = { ...setData,
        "isReceiverDeparture.status": true,
        "isReceiverDeparture.createdTime": options.data.FObject[0].FGPSTime,
        "isReceiverDeparture.latitude": options.data.FObject[0].FLatitude,
        "isReceiverDeparture.longitude": options.data.FObject[0].FLongitude
      };
    }
  }

  if (payload.status == "cancel") {
    setData = {
      isCancelled: true
    };
  }

  return await _shipment.default.findByIdAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.id)
  }, {
    $set: setData
  }, {
    new: true
  });
};
/**
 *
 * @param {*} payload
 * @description - delete shipment
 */


exports.updateStatus = updateStatus;

const deleteShipment = async payload => {
  return await _shipment.default.deleteShipment(payload);
};
/**
 *
 * @param {*} payload
 * @description - list of active shipment
 */


exports.deleteShipment = deleteShipment;

const listActiveShipment = async payload => {
  let query = {
    isDeleted: {
      $eq: false
    },
    isCompleted: {
      $eq: false
    }
  };
  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;

  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = { ...query,
      $or: [{
        unitNumber: {
          $regex: regex
        }
      }, {
        trailerNumber: {
          $regex: regex
        }
      }, {
        driverName: {
          $regex: regex
        }
      }, {
        broker: {
          $regex: regex
        }
      }, {
        brokerAgent: {
          $regex: regex
        }
      }]
    };
    var data = await _shipment.default.listActiveShipment(payload, query, sortBy, sortValue);
  } else {
    var data = await _shipment.default.listActiveShipment(payload, query, sortBy, sortValue);
  }

  const totalRecords = await data.totalRecords;
  return {
    list: await data.list,
    total: totalRecords.length,
    limit: payload["limit"] ? payload["limit"] : 10
  };
};
/**
 *
 * @param {*} payload
 * @description - list of inactive shipment
 */


exports.listActiveShipment = listActiveShipment;

const listInactiveShipment = async payload => {
  let query = {
    isDeleted: {
      $eq: false
    },
    isCompleted: {
      $eq: true
    }
  };
  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;

  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = { ...query,
      $or: [{
        unitNumber: {
          $regex: regex
        }
      }, {
        trailerNumber: {
          $regex: regex
        }
      }, {
        driverName: {
          $regex: regex
        }
      }, {
        broker: {
          $regex: regex
        }
      }, {
        brokerAgent: {
          $regex: regex
        }
      }]
    };
    var data = await _shipment.default.listActiveShipment(payload, query, sortBy, sortValue);
  } else {
    var data = await _shipment.default.listActiveShipment(payload, query, sortBy, sortValue);
  }

  const totalRecords = await data.totalRecords;
  return {
    list: await data.list,
    total: totalRecords.length,
    limit: payload["limit"] ? payload["limit"] : 10
  };
};
/**
 *
 * @param {*} payload
 * @description - list of shipment
 */


exports.listInactiveShipment = listInactiveShipment;

const listAlarm = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let match = {
    isDeleted: false
  };
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999));

  if (payload.status == undefined || payload.status == "" || payload.status == "current") {
    match = { ...match,
      createdAt: {
        $gte: startOfDay,
        $lt: endOfDay
      }
    };
  }

  if (payload.status == "past") {
    match = { ...match,
      createdAt: {
        $lte: startOfDay
      }
    };
  }

  let query = [{
    $match: match
  }, {
    $lookup: {
      from: "shipments",
      let: {
        id: "$shipmentId"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$_id", "$$id"]
            }]
          }
        }
      }],
      as: "ShipmentData"
    }
  }, {
    $unwind: {
      path: "$ShipmentData",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _alarm.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let alarmList = await _alarm.default.aggregate(query);
  return {
    data: alarmList,
    total: total
  };
};

exports.listAlarm = listAlarm;

const downloadxls = async (user, payload) => {
  return new Promise(async resolve => {
    await setTimeout(async () => {
      let historyData = await _history.default.find({
        shipmentId: _mongoose.default.Types.ObjectId(payload.id)
      }, {
        _id: 0,
        createdAt: 0,
        updatedAt: 0,
        __v: 0
      });
      let wb = new xl.Workbook();
      let stringStyle = wb.createStyle({
        size: 12
      });
      let style = wb.createStyle({
        font: {
          size: 12,
          bold: true
        }
      });
      let ws = wb.addWorksheet("Report", {});
      ws.cell(1, 1).string("Bat").style(style);
      ws.cell(1, 2).string("CID").style(style);
      ws.cell(1, 3).string("Dir").style(style);
      ws.cell(1, 4).string("GT").style(style);
      ws.cell(1, 5).string("Hum1").style(style);
      ws.cell(1, 6).string("Hum2").style(style);
      ws.cell(1, 7).string("LAC").style(style);
      ws.cell(1, 8).string("LType").style(style);
      ws.cell(1, 9).string("Lat").style(style);
      ws.cell(1, 10).string("Lon").style(style);
      ws.cell(1, 11).string("MCC").style(style);
      ws.cell(1, 12).string("MNC").style(style);
      ws.cell(1, 13).string("Mil").style(style);
      ws.cell(1, 14).string("RT").style(style);
      ws.cell(1, 15).string("Speed").style(style);
      ws.cell(1, 16).string("Temp1").style(style);
      ws.cell(1, 17).string("Temp2").style(style); // let HEADER_ROW = [
      //   {
      //     value: "Shipment Id",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Trailer Id",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Bat",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "CID",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Dir",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "GT",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Hum1",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Hum2",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "LAC",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "LType",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Lat",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Lon",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "MCC",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "MNC",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Mil",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "RT",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Speed",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Temp1",
      //     fontWeight: "bold",
      //   },
      //   {
      //     value: "Temp2",
      //     fontWeight: "bold",
      //   },
      // ];

      let fileName = `${Date.now()}-${payload.id}`;
      fileName = fileName + "-shipment.xlsx";
      /*********  Upload Image File *********/

      let src = `public/uploads/${fileName}`;
      let row = 2;
      await Promise.all(await historyData.map((todo, k) => {
        ws.cell(row + k, 1).string(todo.Bat.toString()).style(stringStyle);
        ws.cell(row + k, 2).string(todo.CID.toString()).style(stringStyle);
        ws.cell(row + k, 3).string(todo.Dir.toString()).style(stringStyle);
        ws.cell(row + k, 4).string(todo.GT.toString()).style(stringStyle);
        ws.cell(row + k, 5).string(todo.Hum1.toString()).style(stringStyle);
        ws.cell(row + k, 6).string(todo.Hum2.toString()).style(stringStyle);
        ws.cell(row + k, 7).string(todo.LAC.toString()).style(stringStyle);
        ws.cell(row + k, 8).string(todo.LType.toString()).style(stringStyle);
        ws.cell(row + k, 9).string(todo.Lat.toString()).style(stringStyle);
        ws.cell(row + k, 10).string(todo.Lon.toString()).style(stringStyle);
        ws.cell(row + k, 11).string(todo.MCC.toString()).style(stringStyle);
        ws.cell(row + k, 12).string(todo.MNC.toString()).style(stringStyle);
        ws.cell(row + k, 13).string(todo.Mil.toString()).style(stringStyle);
        ws.cell(row + k, 14).string(todo.RT.toString()).style(stringStyle);
        ws.cell(row + k, 15).string(todo.Speed.toString()).style(stringStyle);
        ws.cell(row + k, 16).string(todo.Temp1.toString()).style(stringStyle);
        ws.cell(row + k, 17).string(todo.Temp2.toString()).style(stringStyle);
      }));
      await wb.write(src);
      await setTimeout(async () => {
        let fileType = {
          mimetype: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        };
        let fileData = await (0, _universal.uploadFile)(fileType, src, "shipment-report/" + fileName);
        resolve(fileData);
      }, 8000);
    }, 6000);
  });
};

exports.downloadxls = downloadxls;

const shareLink = async (user, payload) => {
  console.log(payload, "payload"); //return false;

  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    email: payload.email,
    emailTemplate: "share-link",
    data: payload
  });
  const emailData = {
    to: payload.email,
    subject: Mail.subjects.shareLink,
    html: result.html,
    templateId: "share-link"
  };
  Mail.SENDEMAIL(emailData, function (err, res) {
    if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
  });
  return true;
};

exports.shareLink = shareLink;