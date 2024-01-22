"use strict";

var _mongoose = _interopRequireDefault(require("mongoose"));

var _user = _interopRequireDefault(require("../collections/user"));

var _shipment = _interopRequireDefault(require("../collections/shipment"));

var _history = _interopRequireDefault(require("../collections/history"));

var _mapData = _interopRequireDefault(require("../collections/mapData"));

var _sensor = _interopRequireDefault(require("../collections/sensor"));

var _deviceMapData = _interopRequireDefault(require("../collections/deviceMapData"));

var _alarm = _interopRequireDefault(require("../collections/alarm"));

var _tempAlert = _interopRequireDefault(require("../collections/tempAlert"));

var _test = _interopRequireDefault(require("../collections/test"));

var _log = _interopRequireDefault(require("../collections/log"));

var _trailer = _interopRequireDefault(require("../collections/trailer"));

var _truck = _interopRequireDefault(require("../collections/truck"));

var _notification = _interopRequireDefault(require("../collections/notification"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var Mail = _interopRequireWildcard(require("../utilities/mail"));

var _config = _interopRequireDefault(require("config"));

var _event = _interopRequireDefault(require("../utilities/event"));

var _axios = _interopRequireDefault(require("axios"));

var _universal = require("../utilities/universal");

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * File Name: utilities/scheduler.js
 * Created By: Aditi
 * Description: cron job
 */
const {
  frontendUrl
} = _config.default.get("app");

/*************************************
    *    *    *    *    *    *
    ┬    ┬    ┬    ┬    ┬    ┬
    │    │    │    │    │    |
    │    │    │    │    │    └ day of week (0 - 7) (0 or 7 is Sun)
    │    │    │    │    └───── month (1 - 12)
    │    │    │    └────────── day of month (1 - 31)
    │    │    └─────────────── hour (0 - 23)               9 
    │    └──────────────────── minute (0 - 59)             0
    └───────────────────────── second (0 - 59, OPTIONAL)   0

********************************************************/
// '0 0 * * *' (*/1 * * * * (per minute))run command at 12 o'clock midnight everyday----//
// 'this will run everyday at 9 Am');
let schedule = require("node-schedule");
/*
 * cron job change the shipment status to start and fetch the real time histroy data 2 hours before the start time
 * cron runs at every 1 min of interval
 */


schedule.scheduleJob("*/1 * * * *", async () => {
  try {
    console.log("hererer");
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken; // let currentTimeStampDate = new Date();

    let currentTimeStamp = _momentTimezone.default.utc().valueOf();

    currentTimeStamp = parseInt(currentTimeStamp) / 1000;
    console.log(currentTimeStamp);
    let match = {
      isStart: false,
      isCompleted: false,
      isDeleted: false
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
    console.log("shipmets", shipmets);

    if (shipmets.length > 0) {
      console.log("here in loop");

      for (let i = 0; i < shipmets.length; i++) {
        // console.log(parseInt(shipmets[i].startTime) - parseInt(currentTimeStamp))
        if (parseInt(parseInt(shipmets[i].startTime) - parseInt(currentTimeStamp)) <= 7200) {
          console.log("in fresh");
          await _shipment.default.findOneAndUpdate({
            _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
          }, {
            $set: {
              isStart: true
            }
          });
        } // let dt1 = moment().utc().format("YYYY-MM-DD HH:mm:ss");
        // let dt2 = moment().utc().subtract(2, "hours");
        // dt2 = dt2.format("YYYY-MM-DD HH:mm:ss");
        // let options = await axios({
        //   method: "post",
        //   url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
        //   headers: {
        //     "Content-Type": "application/json",
        //   },
        //   data: {
        //     FTokenID: sensorToken,
        //     FAction: "QueryLBSTrackListByFGUID",
        //     FGUID: shipmets[i].sensorData.FGUID,
        //     FType: 1,
        //     FAssetTypeID: shipmets[i].sensorData.FAssetTypeID,
        //     FStartTime: dt2,
        //     FEndTime: dt1,
        //     // FLanguage: 0,
        //     FDateType: 1,
        //   },
        // });
        // for (let m = 0; m < options.data.FObject.length; m++) {
        //   let tempInF = options.data.FObject[m].Temp1 * 9 / 5 + 32
        // }
        // let finalData = await options.data.FObject.map((k) => ({
        //   ...k,
        //   Temp1: chngTmpInF(k.Temp1),
        //   shipmentId: shipmets[i]._id,
        // }));
        // await HISTORYMODEL.insertMany(finalData);

      }

      return true;
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/*
 * cron job fetch the real time sensor history data at evey 5 minutes of interval w.r.t shipment
 * cron runs at every 5 min of interval
 */

schedule.scheduleJob("*/5 * * * *", async () => {
  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken;

    let currentTimeStamp = _momentTimezone.default.utc().valueOf();

    let match = {
      startTime: {
        $lte: currentTimeStamp
      },
      isStart: true,
      isCompleted: false,
      isDeleted: false
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

    if (shipmets.length > 0) {
      for (let i = 0; i < shipmets.length; i++) {
        let dt1 = (0, _momentTimezone.default)().utc().format("YYYY-MM-DD HH:mm:ss");
        let dt2 = (0, _momentTimezone.default)().utc().subtract(5, "minutes");
        dt2 = dt2.format("YYYY-MM-DD HH:mm:ss");
        let options = await (0, _axios.default)({
          method: "post",
          url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            FTokenID: sensorToken,
            FAction: "QueryLBSTrackListByFGUID",
            FGUID: shipmets[i].sensorData.FGUID,
            FType: 1,
            FAssetTypeID: shipmets[i].sensorData.FAssetTypeID,
            FStartTime: dt2,
            FEndTime: dt1,
            // FLanguage: 0,
            FDateType: 1
          }
        });
        let finalData = await options.data.FObject.map(k => ({ ...k,
          Temp1: (0, _universal.chngTmpInF)(k.Temp1),
          shipmentId: shipmets[i]._id,
          trailerId: shipmets[i].trailerId,
          deviceId: shipmets[i].sensorData._id
        }));
        await _history.default.insertMany(finalData);
      }

      return true;
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/* Alarm cron */
// schedule.scheduleJob("*/5 * * * *", async () => {
//   try {
//     let userData = await USERMODEL.findOne({ role: 1 });
//     let sensorToken = userData.sensorToken;
//     let currentTimeStamp = moment.utc().valueOf();
//     currentTimeStamp = parseInt(currentTimeStamp);
//     let match = {
//       isStart: true,
//       isCompleted: false,
//       isDeleted: false,
//       isCancelled: false,
//     };
//     const query = [
//       { $match: match },
//       {
//         $lookup: {
//           from: "trailers",
//           localField: "trailerId",
//           foreignField: "_id",
//           as: "trailerData",
//         },
//       },
//       { $unwind: "$trailerData" },
//       {
//         $lookup: {
//           from: "sensors",
//           localField: "trailerData.sensorId",
//           foreignField: "_id",
//           as: "sensorData",
//         },
//       },
//       { $unwind: "$sensorData" },
//       {
//         $lookup: {
//           from: "users",
//           localField: "carrierId",
//           foreignField: "_id",
//           as: "carrierInfo",
//         },
//       },
//       { $unwind: "$carrierInfo" },
//     ];
//     let shipmets = await SHIPMENTMODEL.aggregate(query);
//     let shipmentIds = shipmets
//       .map(function (e) {
//         return e.sensorData.FGUID;
//       })
//       .join(",");
//     let dt1 = moment().utc().format("YYYY-MM-DD HH:mm:ss");
//     let dt2 = moment().utc().subtract(5, "minutes");
//     dt2 = dt2.format("YYYY-MM-DD HH:mm:ss");
//     let options = await axios({
//       method: "post",
//       url: "http://icloud.assetscontrols.com:8092/OpenApi/Report",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: {
//         FTokenID: sensorToken,
//         FAction: "QueryMessageAlarmList",
//         FGUIDs: shipmentIds,
//         FSelectType: 1,
//         FStartTime: dt2, //"2023-07-01 15:59:59",
//         FEndTime: dt1, //"2023-07-19 15:59:59",
//         FDataTypes: "31,63,316",
//         FDateType: 1,
//       },
//     });
//     let finalData = [];
//     shipmets = shipmets.map((k, index) => {
//       console.log(k._id);
//       options.data.FObject.map(async (j, index1) => {
//         if (j.FAssetID == k.sensorData.FAssetID) {
//           options.data.FObject[index1].shipmentId = k._id;
//           finalData.push(options.data.FObject[index1]);
//           let parsedData = JSON.parse(
//             options.data.FObject[index1].FDescribeJSON
//           );
//           let text = "";
//           if (parsedData.T == 1) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") temerature raised to " +
//               parsedData.F;
//           } else if (parsedData.T == 2) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") temerature reduced to " +
//               parsedData.F;
//           } else if (parsedData.T == 3) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") humidity raised to " +
//               parsedData.F;
//           } else if (parsedData.T == 4) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") humidity raised to " +
//               parsedData.F;
//           } else if (parsedData.T == 5) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") has high light i.e.  " +
//               parsedData.F;
//           } else if (parsedData.T == 6) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") has low light i.e. " +
//               parsedData.F;
//           } else if (parsedData.T == 7) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") has high air pressure " +
//               parsedData.F;
//           } else if (parsedData.T == 8) {
//             text =
//               "Sensor (" +
//               k.sensorData.FAssetID +
//               ") has low air pressure " +
//               parsedData.F;
//           }
//           let obj = {
//             text: text,
//             type: "alarm",
//             senderId: userData._id,
//             receiverId: k.carrierId,
//             shipmentId: k._id,
//           };
//           await NOTIFICATIONMODEL.saveNotification(obj);
//           const result = await Mail.htmlFromatWithObject({
//             frontendUrl: frontendUrl,
//             emailTemplate: "alarm-alert",
//             // parsedData:parsedData,
//             data: k,
//           });
//           const emailData = {
//             to: k.carrierInfo.email,
//             subject: Mail.subjects.alarmAlert + "(" + k.loadId + ")",
//             html: result.html,
//             templateId: "alarm-alert",
//           };
//           Mail.SENDEMAIL(emailData, function (err, res) {
//             if (err)
//               console.log(
//                 "-----@@----- Error at sending verify mail to user -----@@-----",
//                 err
//               );
//             else
//               console.log(
//                 "-----@@----- Response at sending verify mail to user -----@@-----",
//                 res
//               );
//           });
//         }
//       });
//     });
//     await ALARMMODEL.insertMany(finalData);
//   } catch (err) {
//     console.log("in catch erro .....................", err);
//   }
// });

/* new cron */

schedule.scheduleJob("*/1 * * * *", async () => {
  try {
    // let currentTimeStamp = moment.utc().valueOf();
    // currentTimeStamp = parseInt(currentTimeStamp / 1000);
    // let realTimeTempVar = {
    //   "FVehicleGUID": "8e9ca246-38ab-4625-ae07-12d00453c50c",
    //   "FVehicleName": "835210000201",
    //   "FAssetGUID": "FBFC256E-7225-4B97-B297-EDF55CCECB15",
    //   "FAssetID": "835210000201",
    //   "FAssetTypeID": 1301,
    //   "FLongitude": -79.745745,
    //   "FLatitude": 43.544789,
    //   "FSpeed": 0,
    //   "FDirection": 0,
    //   "FMileage": 0,
    //   "FGPSTime": "2023-08-09T11:47:20Z",
    //   "FGPSTimestamp": 1691581640000,
    //   "FRecvTime": "2023-08-09T11:47:24.636421Z",
    //   "FRecvTimestamp": 1691581644636,
    //   "FLocationType": 1,
    //   "FCellSignal": 26,
    //   "FGPSSignal": 6,
    //   "FMNC": 720,
    //   "FMCC": 302,
    //   "FLAC": 30118,
    //   "FCELLID": 10278266,
    //   "FBattery": 10,
    //   "FACC": -1,
    //   "FAlarm": -1,
    //   "FLockRope": -1,
    //   "FLockStatus": -1,
    //   "FFuelCut": -1,
    //   "FDoor": -1,
    //   "FMotor": -1,
    //   "FFuelValue1": -1,
    //   "FFuelValue2": -1,
    //   "FFuelValue3": -1,
    //   "FTemperature1": 76.1,
    //   "FTemperature2": -1000,
    //   "FTemperature3": -1000,
    //   "FTemperature4": -1000,
    //   "FTemperature5": -1000,
    //   "FTemperature6": -1000,
    //   "FHumidity1": 55,
    //   "FHumidity2": 0,
    //   "FHumidity3": 0,
    //   "FHumidity4": 0,
    //   "FHumidity5": 0,
    //   "FHumidity6": 0,
    //   "FExpandProto": {
    //     "FAwaken": -1,
    //     "FPosture": null,
    //     "FDesc": "{\"fAcceleration\":\"x:0;y:0;z:0\",\"fBackCover\":-1,\"fChange\":0,\"fLx\":11,\"fMainBattery\":-1,\"fNetworkType\":4,\"fPosture\":\"x:0;y:0;z:0\",\"fVibrate\":0,\"fVoltage\":3.64,\"imei\":\"868822045685631\"}"
    //   },
    //   "SubAssets": {},
    //   "FClassify": 9,
    //   "FRunStatus": 0,
    //   "FAwaken": 1
    // };
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken;
    let match = {
      isStart: true,
      isCompleted: false,
      isDeleted: false,
      isCancelled: false
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
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "carrierInfo"
      }
    }, {
      $unwind: "$carrierInfo"
    }];
    let shipmets = await _shipment.default.aggregate(query);
    let shipmentIds = shipmets.map(function (e) {
      return e.sensorData.FGUID;
    }).join(","); //  console.log('herrerrere adit gol',shipmentIds)
    //  return false;
    //console.log('shipmentIds',shipmentIds)
    //shipmentIds = "ec0b7af5-1f81-4739-abb0-caf97186b027,ec0b7af5-1f81-4739-abb0-caf97186b027,ec0b7af5-1f81-4739-abb0-caf97186b027"

    let options = await (0, _axios.default)({
      method: "post",
      url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        FTokenID: sensorToken,
        FAction: "QueryLBSMonitorListByFGUIDs",
        FGUIDs: shipmentIds,
        FType: 1
      }
    }); // console.log('options.data.FObject---aditi',options.data.FObject)
    // return false;

    shipmets = shipmets.map((k, index) => {
      let obj = { ...k
      };
      let FobjectIndex = options.data.FObject.findIndex(itm => itm.FAssetID == obj.sensorData.FAssetID);

      if (FobjectIndex != -1) {
        obj["realTimeData"] = options.data.FObject[FobjectIndex];
      } else {
        obj["realTimeData"] = {};
      }

      return obj;
    }); // console.log("shipmets---aditi", shipmets);
    //  return false;

    if (shipmets.length > 0) {
      for (let i = 0; i < shipmets.length; i++) {
        console.log("hererer in loop"); // shipper - arrival

        if (shipmets[i].isShipperArrival.status == false) {
          let getDistanceValue = await (0, _universal.getDistance)(shipmets[i].shipper[0].latitude, shipmets[i].shipper[0].longitude, shipmets[i].realTimeData.FLatitude, shipmets[i].realTimeData.FLongitude); //  getDistanceValue = getDistanceValue * 1.60934;
          // let leftTime = parseInt(
          //   (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
          // );

          if (getDistanceValue <= 0.5) {
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
            }, {
              $set: {
                "isShipperArrival.status": true,
                "isShipperArrival.createdTime": shipmets[i].realTimeData.FGPSTime,
                "isShipperArrival.latitude": shipmets[i].realTimeData.FLatitude,
                "isShipperArrival.longitude": shipmets[i].realTimeData.FLongitude
              }
            }); // waiting

            let lightFlx = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc);
            lightFlx = lightFlx.fLx;

            if (lightFlx == 0) {
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
              }, {
                $set: {
                  "isShipperWaiting.status": true,
                  "isShipperWaiting.createdTime": shipmets[i].realTimeData.FGPSTime,
                  "isShipperWaiting.latitude": shipmets[i].realTimeData.FLatitude,
                  "isShipperWaiting.longitude": shipmets[i].realTimeData.FLongitude
                }
              });
            }
          }
        } // shipper - checkin
        // if (
        //   shipmets[i].isShipperArrival.status == true &&
        //   shipmets[i].isShipperCheckIn.status == false
        // ) {
        //   console.log("herer in checkin");
        //   let getDistanceValue = await getDistance(
        //     shipmets[i].shipper[0].latitude,
        //     shipmets[i].shipper[0].longitude,
        //     shipmets[i].realTimeData.FLatitude,
        //     shipmets[i].realTimeData.FLongitude
        //   );
        //   getDistanceValue = getDistanceValue * 1.60934;
        //   let leftTime = parseInt(
        //     (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
        //   );
        //   //leftTime >= 4 &&
        //   if (leftTime <= 7) {
        //     await SHIPMENTMODEL.findOneAndUpdate(
        //       { _id: mongoose.Types.ObjectId(shipmets[i]._id) },
        //       {
        //         $set: {
        //           "isShipperCheckIn.status": true,
        //           "isShipperCheckIn.createdTime":
        //             shipmets[i].realTimeData.FGPSTime,
        //         },
        //       }
        //     );
        //   }
        // }
        // shipper - waiting
        // if (
        //   shipmets[i].isShipperArrival.status == true &&
        //   // shipmets[i].isShipperCheckIn.status == true &&
        //   shipmets[i].isShipperWaiting.status == false
        // ) {
        // console.log("herere in waiting");
        // let getDistanceValue = await getDistance(
        //   shipmets[i].shipper[0].latitude,
        //   shipmets[i].shipper[0].longitude,
        //   shipmets[i].realTimeData.FLatitude,
        //   shipmets[i].realTimeData.FLongitude
        // );
        // getDistanceValue = getDistanceValue * 1.60934;
        // let leftTime = parseInt(
        //   (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
        // );
        //   let lightFlx = JSON.parse(
        //     shipmets[i].realTimeData?.FExpandProto?.FDesc
        //   );
        //   lightFlx = lightFlx.fLx;
        //   if (lightFlx == 0) {
        //     await SHIPMENTMODEL.findOneAndUpdate(
        //       { _id: mongoose.Types.ObjectId(shipmets[i]._id) },
        //       {
        //         $set: {
        //           "isShipperWaiting.status": true,
        //           "isShipperWaiting.createdTime":
        //             shipmets[i].realTimeData.FGPSTime,
        //         },
        //       }
        //     );
        //   }
        // }
        // shipper - loading


        if (shipmets[i].isShipperArrival.status == true && //  shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == false) {
          let lightFlx = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc);
          lightFlx = lightFlx.fLx; //  console.log('hererre in loading',JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc))
          //  let abc = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc)

          if (lightFlx > 0) {
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
            }, {
              $set: {
                "isShipperLoading.status": true,
                "isShipperLoading.createdTime": shipmets[i].realTimeData.FGPSTime,
                "isShipperLoading.latitude": shipmets[i].realTimeData.FLatitude,
                "isShipperLoading.longitude": shipmets[i].realTimeData.FLongitude
              }
            });
          }
        } // shipper - loading complete / checkout


        if (shipmets[i].isShipperArrival.status == true && // shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == true && shipmets[i].isShipperLoadingComplete.status == false // && shipmets[i].isShipperCheckout.status == false
        ) {
            let lightFlx = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc);
            lightFlx = lightFlx.fLx;

            if (lightFlx == 0) {
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
              }, {
                $set: {
                  "isShipperLoadingComplete.status": true,
                  "isShipperLoadingComplete.createdTime": shipmets[i].realTimeData.FGPSTime,
                  "isShipperLoadingComplete.latitude": shipmets[i].realTimeData.FLatitude,
                  "isShipperLoadingComplete.longitude": shipmets[i].realTimeData.FLongitude
                }
              }); // Original date and time

              const FGPSTime = new Date(shipmets[i].realTimeData.FGPSTime); // Add 10 minutes

              FGPSTime.setMinutes(FGPSTime.getMinutes() + 10); // Convert the updated date and time to a string

              const updatedTime = FGPSTime.toISOString();
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
              }, {
                $set: {
                  "isShipperCheckout.status": true,
                  "isShipperCheckout.createdTime": updatedTime,
                  "isShipperCheckout.latitude": shipmets[i].realTimeData.FLatitude,
                  "isShipperCheckout.longitude": shipmets[i].realTimeData.FLongitude
                }
              });
            }
          } // shipper - departure


        if (shipmets[i].isShipperArrival.status == true && //    shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == true && shipmets[i].isShipperLoadingComplete.status == true && shipmets[i].isShipperCheckout.status == true && shipmets[i].isShipperDeparture.status == false) {
          let getDistanceValue = await (0, _universal.getDistance)(shipmets[i].shipper[0].latitude, shipmets[i].shipper[0].longitude, shipmets[i].realTimeData.FLatitude, shipmets[i].realTimeData.FLongitude);
          getDistanceValue = getDistanceValue * 1.60934; // let leftTime = parseInt(
          //   (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
          // );
          // && leftTime <= 7

          if (getDistanceValue >= 3) {
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
            }, {
              $set: {
                "isShipperDeparture.status": true,
                "isShipperDeparture.createdTime": shipmets[i].realTimeData.FGPSTime,
                "isShipperDeparture.latitude": shipmets[i].realTimeData.FLatitude,
                "isShipperDeparture.longitude": shipmets[i].realTimeData.FLongitude
              }
            });
            let obj = {
              text: "Your shipment (" + shipmets[i].loadId + ") has been departed from the shipper end.",
              type: "shipment",
              senderId: userData._id,
              receiverId: shipmets[i].carrierId,
              shipmentId: shipmets[i]._id
            };
            await _notification.default.saveNotification(obj);
            const result = await Mail.htmlFromatWithObject({
              frontendUrl: frontendUrl,
              emailTemplate: "shipmentDepart",
              data: shipmets[i]
            });
            const emailData = {
              to: shipmets[i].carrierInfo.email,
              subject: Mail.subjects.shipment + "departed (" + shipmets[i].loadId + ")",
              html: result.html,
              templateId: "shipmentDepart"
            };
            Mail.SENDEMAIL(emailData, function (err, res) {
              if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
            });
          }
        } // receiver - arrival


        if (shipmets[i].isShipperArrival.status == true && //  shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == true && shipmets[i].isShipperLoadingComplete.status == true && shipmets[i].isShipperCheckout.status == true && shipmets[i].isShipperDeparture.status == true && shipmets[i].isReceiverArrival.status == false) {
          let getDistanceValue = await (0, _universal.getDistance)(shipmets[i].receiver[0].latitude, shipmets[i].receiver[0].longitude, shipmets[i].realTimeData.FLatitude, shipmets[i].realTimeData.FLongitude); // getDistanceValue = getDistanceValue * 1.60934;
          // let leftTime = parseInt(
          //   (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
          // );

          if (getDistanceValue <= 0.5) {
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
            }, {
              $set: {
                "isReceiverArrival.status": true,
                "isReceiverArrival.createdTime": shipmets[i].realTimeData.FGPSTime,
                "isReceiverArrival.latitude": shipmets[i].realTimeData.FLatitude,
                "isReceiverArrival.longitude": shipmets[i].realTimeData.FLongitude
              }
            });
            let lightFlx = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc);
            lightFlx = lightFlx.fLx;

            if (lightFlx == 0) {
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
              }, {
                $set: {
                  "isReceiverWaiting.status": true,
                  "isReceiverWaiting.createdTime": shipmets[i].realTimeData.FGPSTime,
                  "isReceiverWaiting.latitude": shipmets[i].realTimeData.FLatitude,
                  "isReceiverWaiting.longitude": shipmets[i].realTimeData.FLongitude
                }
              });
            }

            let obj = {
              text: "Your shipment (" + shipmets[i].loadId + ") has been arrived to the location.",
              type: "shipment",
              senderId: userData._id,
              receiverId: shipmets[i].carrierId,
              shipmentId: shipmets[i]._id
            };
            await _notification.default.saveNotification(obj);
            const result = await Mail.htmlFromatWithObject({
              frontendUrl: frontendUrl,
              emailTemplate: "shipment",
              data: shipmets[i]
            });
            const emailData = {
              to: shipmets[i].carrierInfo.email,
              subject: Mail.subjects.shipment + "arrived (" + shipmets[i].loadId + ")",
              html: result.html,
              templateId: "shipment"
            };
            Mail.SENDEMAIL(emailData, function (err, res) {
              if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
            });
          }
        } // receiver - checkin
        // if (
        //   shipmets[i].isShipperArrival.status == true &&
        //   shipmets[i].isShipperCheckIn.status == true &&
        //   shipmets[i].isShipperWaiting.status == true &&
        //   shipmets[i].isShipperLoading.status == true &&
        //   shipmets[i].isShipperCheckout.status == true &&
        //   shipmets[i].isShipperDeparture.status == true &&
        //   shipmets[i].isReceiverArrival.status == true &&
        //   shipmets[i].isReceiverCheckin.status == false
        // ) {
        //   let getDistanceValue = await getDistance(
        //     shipmets[i].receiver[0].latitude,
        //     shipmets[i].receiver[0].longitude,
        //     shipmets[i].realTimeData.FLatitude,
        //     shipmets[i].realTimeData.FLongitude
        //   );
        //   getDistanceValue = getDistanceValue * 1.60934;
        //   let leftTime = parseInt(
        //     (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
        //   );
        //   //leftTime > 4 &&
        //   if (leftTime <= 7) {
        //     await SHIPMENTMODEL.findOneAndUpdate(
        //       { _id: mongoose.Types.ObjectId(shipmets[i]._id) },
        //       {
        //         $set: {
        //           "isReceiverCheckin.status": true,
        //           "isReceiverCheckin.createdTime":
        //             shipmets[i].realTimeData.FGPSTime,
        //         },
        //       }
        //     );
        //   }
        // }
        // receiver - waiting
        // if (
        //   shipmets[i].isShipperArrival.status == true &&
        //   //      shipmets[i].isShipperCheckIn.status == true &&
        //   shipmets[i].isShipperWaiting.status == true &&
        //   shipmets[i].isShipperLoading.status == true &&
        //   shipmets[i].isShipperCheckout.status == true &&
        //   shipmets[i].isShipperDeparture.status == true &&
        //   shipmets[i].isReceiverArrival.status == true &&
        //   ///    shipmets[i].isReceiverCheckin.status == true &&
        //   shipmets[i].isReceiverWaiting.status == false
        // ) {
        // let getDistanceValue = await getDistance(
        //   shipmets[i].receiver[0].latitude,
        //   shipmets[i].receiver[0].longitude,
        //   shipmets[i].realTimeData.FLatitude,
        //   shipmets[i].realTimeData.FLongitude
        // );
        // getDistanceValue = getDistanceValue * 1.60934;
        // let leftTime = parseInt(
        //   (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
        // );
        //   let lightFlx = JSON.parse(
        //     shipmets[i].realTimeData?.FExpandProto?.FDesc
        //   );
        //   lightFlx = lightFlx.fLx;
        //   if (lightFlx == 0) {
        //     await SHIPMENTMODEL.findOneAndUpdate(
        //       { _id: mongoose.Types.ObjectId(shipmets[i]._id) },
        //       {
        //         $set: {
        //           "isReceiverWaiting.status": true,
        //           "isReceiverWaiting.createdTime":
        //             shipmets[i].realTimeData.FGPSTime,
        //         },
        //       }
        //     );
        //   }
        // }
        // receiver - unloading


        if (shipmets[i].isShipperArrival.status == true && //    shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == true && shipmets[i].isShipperLoadingComplete.status == true && shipmets[i].isShipperCheckout.status == true && shipmets[i].isShipperDeparture.status == true && shipmets[i].isReceiverArrival.status == true && //    shipmets[i].isReceiverCheckin.status == true &&
        shipmets[i].isReceiverWaiting.status == true && shipmets[i].isReceiverUnloading.status == false) {
          let lightFlx = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc);
          lightFlx = lightFlx.fLx;

          if (lightFlx > 0) {
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
            }, {
              $set: {
                "isReceiverUnloading.status": true,
                "isReceiverUnloading.createdTime": shipmets[i].realTimeData.FGPSTime,
                "isReceiverUnloading.latitude": shipmets[i].realTimeData.FLatitude,
                "isReceiverUnloading.longitude": shipmets[i].realTimeData.FLongitude
              }
            });
          }
        } // receiver - unloading complete / checkout


        if (shipmets[i].isShipperArrival.status == true && //     shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == true && shipmets[i].isShipperLoadingComplete.status == true && shipmets[i].isShipperCheckout.status == true && shipmets[i].isShipperDeparture.status == true && shipmets[i].isReceiverArrival.status == true && //     shipmets[i].isReceiverCheckin.status == true &&
        shipmets[i].isReceiverWaiting.status == true && shipmets[i].isReceiverUnloading.status == true && shipmets[i].isReceiverUnLoadingComplete.status == false //  &&  shipmets[i].isReceiverCheckout.status == false
        ) {
            let lightFlx = JSON.parse(shipmets[i].realTimeData?.FExpandProto?.FDesc);
            lightFlx = lightFlx.fLx;

            if (lightFlx == 0) {
              // let traileInfo = await TRAILERMODEL.findOne({
              //   _id: mongoose.Types.ObjectId(shipmets[i].trailerId),
              // });
              // let updatedHours = traileInfo.currentHours + shipmets[i].totalHours;
              // await TRAILERMODEL.update(
              //   { _id: mongoose.Types.ObjectId(shipmets[i].trailerId) },
              //   {
              //     $set: {
              //       currentHours: updatedHours,
              //     },
              //   }
              // );
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
              }, {
                $set: {
                  "isReceiverUnLoadingComplete.status": true,
                  "isReceiverUnLoadingComplete.createdTime": shipmets[i].realTimeData.FGPSTime,
                  "isReceiverUnLoadingComplete.latitude": shipmets[i].realTimeData.FLatitude,
                  "isReceiverUnLoadingComplete.longitude": shipmets[i].realTimeData.FLongitude //  isCompleted: true,

                }
              }); // Original date and time

              const FGPSTime = new Date(shipmets[i].realTimeData.FGPSTime); // Add 10 minutes

              FGPSTime.setMinutes(FGPSTime.getMinutes() + 10); // Convert the updated date and time to a string

              const updatedTime = FGPSTime.toISOString();
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
              }, {
                $set: {
                  "isReceiverCheckout.status": true,
                  "isReceiverCheckout.createdTime": updatedTime,
                  //shipmets[i].realTimeData.FGPSTime,
                  "isReceiverCheckout.latitude": shipmets[i].realTimeData.FLatitude,
                  "isReceiverCheckout.longitude": shipmets[i].realTimeData.FLongitude //  isCompleted: true,

                }
              });
            }
          } // receiver - departure


        if (shipmets[i].isShipperArrival.status == true && //     shipmets[i].isShipperCheckIn.status == true &&
        shipmets[i].isShipperWaiting.status == true && shipmets[i].isShipperLoading.status == true && shipmets[i].isShipperCheckout.status == true && shipmets[i].isShipperDeparture.status == true && shipmets[i].isReceiverArrival.status == true && //    shipmets[i].isReceiverCheckin.status == true &&
        shipmets[i].isReceiverWaiting.status == true && shipmets[i].isReceiverUnloading.status == true && shipmets[i].isReceiverUnLoadingComplete.status == true && shipmets[i].isReceiverCheckout.status == true && shipmets[i].isReceiverDeparture.status == false) {
          let getDistanceValue = await (0, _universal.getDistance)(shipmets[i].receiver[0].latitude, shipmets[i].receiver[0].longitude, shipmets[i].realTimeData.FLatitude, shipmets[i].realTimeData.FLongitude);
          getDistanceValue = getDistanceValue * 1.60934; // let leftTime = parseInt(
          //   (getDistanceValue / shipmets[i].realTimeData.FSpeed) * 60
          // );
          // && leftTime <= 7

          if (getDistanceValue >= 3) {
            // let traileInfo = await TRAILERMODEL.findOne({
            //   _id: mongoose.Types.ObjectId(shipmets[i].trailerId),
            // });
            // let updatedHours = traileInfo.currentHours + shipmets[i].totalHours;
            // await TRAILERMODEL.update(
            //   { _id: mongoose.Types.ObjectId(shipmets[i].trailerId) },
            //   {
            //     $set: {
            //       currentHours: updatedHours,
            //     },
            //   }
            // );
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(shipmets[i]._id)
            }, {
              $set: {
                "isReceiverDeparture.status": true,
                "isReceiverDeparture.createdTime": shipmets[i].realTimeData.FGPSTime,
                "isReceiverDeparture.latitude": shipmets[i].realTimeData.FLatitude,
                "isReceiverDeparture.longitude": shipmets[i].realTimeData.FLongitude,
                isCompleted: true
              }
            });
          }
        }
      } //return true;

    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/* logs to check */

schedule.scheduleJob({
  hour: 23,
  minute: 59
}, async () => {
  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken;
    let startDate = (0, _momentTimezone.default)(new Date()).format("YYYY-MM-DD") + " " + "00:00:00";
    let endDate = (0, _momentTimezone.default)(new Date()).format("YYYY-MM-DD") + " " + "23:59:59";
    let options = await (0, _axios.default)({
      method: "post",
      url: "http://icloud.assetscontrols.com:8092/OpenApi/Report",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        FTokenID: sensorToken,
        //"71f8dbba-37af-477b-a66b-e2e01e882939",
        FAction: "QueryReportStatusTrack",
        FGUID: "8279cd58-384e-46ad-8e53-0e9e2ac78579",
        // FType: 1,
        FStartTime: startDate,
        FEndTime: endDate,
        FSelectType: 0
      }
    });
    await _log.default.insertMany(options.data.FObject);
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/* corn to send notification to carrier for trailer 2500 service hour */

schedule.scheduleJob({
  hour: 23,
  minute: 59
}, async () => {
  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let trailers = await _trailer.default.aggregate([{
      $match: {
        currentHours: {
          $gte: 2500
        },
        isDeleted: false
      }
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "userData"
      }
    }, {
      $unwind: "$userData"
    }]);

    if (trailers.length > 0) {
      for (let i = 0; i < trailers.length; i++) {
        let obj = {
          text: "your trailer (" + trailers[i].unitNumber + ") engine has exceeded 2500 hours",
          type: "service",
          senderId: userData._id,
          receiverId: trailers[i].userData._id,
          trailerId: trailers[i]._id
        };
        await _notification.default.saveNotification(obj);
        const result = await Mail.htmlFromatWithObject({
          frontendUrl: frontendUrl,
          emailTemplate: "service-hour",
          data: trailers[i]
        });
        const emailData = {
          to: trailers[i].userData.email,
          subject: Mail.subjects.serviceHour + "(" + trailers[i].unitNumber + ")",
          html: result.html,
          templateId: "service-hour"
        };
        Mail.SENDEMAIL(emailData, function (err, res) {
          if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
        });
      }
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/* corn to send notification to carrier for expiry of trailer registration { hour: 23, minute: 59 }*/

schedule.scheduleJob({
  hour: 23,
  minute: 59
}, async () => {
  try {
    console.log("in trailer registartion");
    let userData = await _user.default.findOne({
      role: 1
    });
    let trailers = await _trailer.default.aggregate([{
      $match: {
        isDeleted: false
      }
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "userData"
      }
    }, {
      $unwind: "$userData"
    }]);

    if (trailers.length > 0) {
      for (let i = 0; i < trailers.length; i++) {
        let currentDate = new Date();
        var Difference_In_Time = trailers[i].registrationExpiry.getTime() - currentDate.getTime();
        var diffInDays = (Difference_In_Time / (1000 * 3600 * 24)).toFixed(0);

        if (diffInDays <= 5) {
          let obj = {
            text: "your trailer (" + trailers[i].unitNumber + ") registration is soon going to expire.",
            type: "expireTrailer",
            senderId: userData._id,
            receiverId: trailers[i].userData._id,
            trailerId: trailers[i]._id
          };
          await _notification.default.saveNotification(obj);
          const result = await Mail.htmlFromatWithObject({
            frontendUrl: frontendUrl,
            type: "trailer",
            emailTemplate: "expire",
            data: trailers[i]
          });
          const emailData = {
            to: trailers[i].userData.email,
            subject: Mail.subjects.expire + "Trailer (" + trailers[i].unitNumber + ")",
            html: result.html,
            templateId: "expire"
          };
          Mail.SENDEMAIL(emailData, function (err, res) {
            if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
          });
        }
      }
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/* corn to send notification to carrier for expiry of truck registration { hour: 23, minute: 59 }*/

schedule.scheduleJob({
  hour: 23,
  minute: 59
}, async () => {
  try {
    console.log("in truck registartion");
    let userData = await _user.default.findOne({
      role: 1
    });
    let trailers = await _truck.default.aggregate([{
      $match: {
        isDeleted: false
      }
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "userData"
      }
    }, {
      $unwind: "$userData"
    }]);

    if (trailers.length > 0) {
      for (let i = 0; i < trailers.length; i++) {
        console.log("trailers-truck", trailers[i]._id);
        let currentDate = new Date();
        var Difference_In_Time = trailers[i].registrationExpiry.getTime() - currentDate.getTime();
        var diffInDays = (Difference_In_Time / (1000 * 3600 * 24)).toFixed(0);

        if (diffInDays <= 5) {
          let obj = {
            text: "your truck (" + trailers[i].unitNumber + ") registration is soon going to expire.",
            type: "expireTruck",
            senderId: userData._id,
            receiverId: trailers[i].userData._id,
            truckId: trailers[i]._id
          };
          await _notification.default.saveNotification(obj);
          const result = await Mail.htmlFromatWithObject({
            frontendUrl: frontendUrl,
            type: "truck",
            emailTemplate: "expire",
            data: trailers[i]
          });
          const emailData = {
            to: trailers[i].userData.email,
            subject: Mail.subjects.expire + "Truck (" + trailers[i].unitNumber + ")",
            html: result.html,
            templateId: "expire"
          };
          Mail.SENDEMAIL(emailData, function (err, res) {
            if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
          });
        }
      }
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/* corn to send notification to carrier for expiry of driver license registration expire{ hour: 23, minute: 59 }*/

schedule.scheduleJob({
  hour: 23,
  minute: 59
}, async () => {
  try {
    console.log("in driver registartion");
    let userData = await _user.default.findOne({
      role: 1
    });
    let trailers = await _user.default.aggregate([{
      $match: {
        isDeleted: false,
        role: 4
      }
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "userData"
      }
    }, {
      $unwind: "$userData"
    }, {
      $lookup: {
        from: "protfolios",
        localField: "_id",
        foreignField: "driverId",
        as: "protfolioData"
      }
    }, {
      $unwind: "$protfolioData"
    }]);

    if (trailers.length > 0) {
      for (let i = 0; i < trailers.length; i++) {
        let currentDate = new Date();
        var Difference_In_Time = trailers[i].protfolioData.licenseExp.getTime() - currentDate.getTime();
        var diffInDays = (Difference_In_Time / (1000 * 3600 * 24)).toFixed(0);

        if (diffInDays <= 5) {
          let obj = {
            text: "your driver (" + trailers[i].id + ") license registration is soon going to expire.",
            type: "expireDriver",
            senderId: userData._id,
            receiverId: trailers[i].userData._id,
            driverId: trailers[i]._id
          };
          await _notification.default.saveNotification(obj);
          const result = await Mail.htmlFromatWithObject({
            frontendUrl: frontendUrl,
            type: "driver",
            emailTemplate: "expire",
            data: trailers[i]
          });
          const emailData = {
            to: trailers[i].userData.email,
            subject: Mail.subjects.expire + "Driver (" + trailers[i].id + ")",
            html: result.html,
            templateId: "expire"
          };
          Mail.SENDEMAIL(emailData, function (err, res) {
            if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
          });
        }
      }
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/*cron at every 5 minutes to get alerts for temperature and door open*/

schedule.scheduleJob("*/5 * * * *", async () => {
  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken;

    let currentTimeStamp = _momentTimezone.default.utc().valueOf();

    let match = {
      isStart: true,
      isCompleted: false,
      isCancelled: false,
      isDeleted: false
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
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "carrierInfo"
      }
    }, {
      $unwind: "$carrierInfo"
    }];
    let shipmets = await _shipment.default.aggregate(query);
    let sensorIds = shipmets.map(function (e) {
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
    });
    shipmets = await Promise.all(shipmets.map(async (k, index) => {
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

      let distanceValue = await (0, _universal.getDistance)(obj.shipper[0].latitude, obj.shipper[0].longitude, options.data.FObject[FobjectIndex].FLatitude, options.data.FObject[FobjectIndex].FLongitude);
      let distanceValuereceiver = await (0, _universal.getDistance)(obj.receiver[0].latitude, obj.receiver[0].longitude, options.data.FObject[FobjectIndex].FLatitude, options.data.FObject[FobjectIndex].FLongitude);
      let lightFlx = JSON.parse(options.data.FObject[FobjectIndex].FExpandProto?.FDesc);
      lightFlx = lightFlx.fLx; // check for temperature
      // if (
      //   (options.data.FObject[FobjectIndex].FTemperature1 >
      //     obj.temperature.max ||
      //     options.data.FObject[FobjectIndex].FTemperature1 <
      //       obj.temperature.min) &&
      //   (distanceValue > 1 || distanceValuereceiver > 1)
      // ) {
      //   let notobj = {
      //     text:
      //       "Temperature is fluctuating for your shipment (" +
      //       obj.loadId +
      //       ")",
      //     type: "alarm",
      //     senderId: userData._id,
      //     receiverId: obj.carrierId,
      //     shipmentId: obj._id,
      //     latitude: options.data.FObject[FobjectIndex].FLatitude,
      //     longitude: options.data.FObject[FobjectIndex].FLongitude,
      //     temperature: options.data.FObject[FobjectIndex].FTemperature1,
      //   };
      //   await NOTIFICATIONMODEL.saveNotification(notobj);
      // }
      // check for light

      if (lightFlx > 0 && distanceValue > 3 && distanceValuereceiver > 3) {
        //  save in db
        let alarmObj = {
          FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
          FAssetID: options.data.FObject[FobjectIndex].FAssetID,
          FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
          FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
          FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
          FLX: lightFlx,
          FLatitude: options.data.FObject[FobjectIndex].FLatitude,
          FLongitude: options.data.FObject[FobjectIndex].FLongitude,
          FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
          FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
          type: 2,
          status: "1",
          doorFlag: true,
          shipmentId: obj._id
        };
        await _alarm.default.saveAlarm(alarmObj);
        let notobj = {
          text: "Door is unlocked for your shipment (" + obj.loadId + ")",
          type: "alarm",
          senderId: userData._id,
          receiverId: obj.carrierId,
          shipmentId: obj._id,
          latitude: options.data.FObject[FobjectIndex].FLatitude,
          longitude: options.data.FObject[FobjectIndex].FLongitude
        };
        await _notification.default.saveNotification(notobj);
        const result = await Mail.htmlFromatWithObject({
          frontendUrl: frontendUrl,
          emailTemplate: "alarm-alert",
          // parsedData:parsedData,
          data: obj
        });
        const emailData = {
          to: obj.carrierInfo.email,
          subject: Mail.subjects.alarmAlert + "(" + obj.loadId + ")",
          html: result.html,
          templateId: "alarm-alert"
        };
        Mail.SENDEMAIL(emailData, function (err, res) {
          if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
        });
      }

      if (lightFlx < 0 && distanceValue > 3 && distanceValuereceiver > 3) {
        //  save in db
        let alaramRecord = await _alarm.default.find({
          type: 2,
          doorFlag: true,
          shipmentId: obj._id
        }).limit(1).sort({
          createdAt: -1
        });

        if (alaramRecord.length > 0) {
          let alarmObj = {
            FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
            FAssetID: options.data.FObject[FobjectIndex].FAssetID,
            FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
            FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
            FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
            FLX: lightFlx,
            FLatitude: options.data.FObject[FobjectIndex].FLatitude,
            FLongitude: options.data.FObject[FobjectIndex].FLongitude,
            FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
            FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
            type: 2,
            status: "2",
            doorFlag: false,
            shipmentId: obj._id
          };
          await _alarm.default.saveAlarm(alarmObj);
          await _alarm.default.findOneAndUpdate({
            _id: alaramRecord[0]._id
          }, {
            $set: {
              doorFlag: false
            }
          });
          let notobj = {
            text: "Door is locked for your shipment (" + obj.loadId + ")",
            type: "alarm",
            senderId: userData._id,
            receiverId: obj.carrierId,
            shipmentId: obj._id,
            latitude: options.data.FObject[FobjectIndex].FLatitude,
            longitude: options.data.FObject[FobjectIndex].FLongitude
          };
          await _notification.default.saveNotification(notobj);
          const result = await Mail.htmlFromatWithObject({
            frontendUrl: frontendUrl,
            emailTemplate: "alarm-alert",
            // parsedData:parsedData,
            data: obj
          });
          const emailData = {
            to: obj.carrierInfo.email,
            subject: Mail.subjects.alarmAlert + "(" + obj.loadId + ")",
            html: result.html,
            templateId: "alarm-alert"
          };
          Mail.SENDEMAIL(emailData, function (err, res) {
            if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
          });
        }
      }

      return obj;
    }));
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
/** cron for temp alert at every 30 minutes */
// schedule.scheduleJob("*/30 * * * *", async () => {
//   try {
//     let userData = await USERMODEL.findOne({ role: 1 });
//     let sensorToken = userData.sensorToken;
//     let currentTimeStamp = moment.utc().valueOf();
//     let match = {
//       isStart: true,
//       isCompleted: false,
//       isCancelled: false,
//       isDeleted: false,
//     };
//     const query = [
//       { $match: match },
//       {
//         $lookup: {
//           from: "trailers",
//           localField: "trailerId",
//           foreignField: "_id",
//           as: "trailerData",
//         },
//       },
//       { $unwind: "$trailerData" },
//       {
//         $lookup: {
//           from: "sensors",
//           localField: "trailerData.sensorId",
//           foreignField: "_id",
//           as: "sensorData",
//         },
//       },
//       { $unwind: "$sensorData" },
//       {
//         $lookup: {
//           from: "users",
//           localField: "carrierId",
//           foreignField: "_id",
//           as: "carrierInfo",
//         },
//       },
//       { $unwind: "$carrierInfo" },
//     ];
//     let shipmets = await SHIPMENTMODEL.aggregate(query);
//     let sensorIds = shipmets
//       .map(function (e) {
//         return e.sensorData.FGUID;
//       })
//       .join(",");
//     let options = await axios({
//       method: "post",
//       url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       data: {
//         FTokenID: sensorToken,
//         FAction: "QueryLBSMonitorListByFGUIDs",
//         FGUIDs: sensorIds,
//         FType: 1,
//       },
//     });
//     shipmets = await Promise.all(
//       shipmets.map(async (k, index) => {
//         let obj = { ...k };
//         //console.log('obj',obj)
//         let FobjectIndex = options.data.FObject.findIndex(
//           (itm) => itm.FAssetID == obj.sensorData.FAssetID
//         );
//         let tempInF =
//           (options.data.FObject[FobjectIndex].FTemperature1 * 9) / 5 + 32;
//         options.data.FObject[FobjectIndex].FTemperature1 = tempInF;
//         if (FobjectIndex != -1) {
//           obj["realTimeData"] = options.data.FObject[FobjectIndex];
//         } else {
//           obj["realTimeData"] = {};
//         }
//         let distanceValue = await getDistance(
//           obj.shipper[0].latitude,
//           obj.shipper[0].longitude,
//           options.data.FObject[FobjectIndex].FLatitude,
//           options.data.FObject[FobjectIndex].FLongitude
//         );
//         let distanceValuereceiver = await getDistance(
//           obj.receiver[0].latitude,
//           obj.receiver[0].longitude,
//           options.data.FObject[FobjectIndex].FLatitude,
//           options.data.FObject[FobjectIndex].FLongitude
//         );
//         let lightFlx = JSON.parse(
//           options.data.FObject[FobjectIndex].FExpandProto?.FDesc
//         );
//         lightFlx = lightFlx.fLx;
//         // check for temperature
//         if (
//           (options.data.FObject[FobjectIndex].FTemperature1 >
//             obj.temperature.max ||
//             options.data.FObject[FobjectIndex].FTemperature1 <
//               obj.temperature.min) &&
//           (distanceValue > 1 || distanceValuereceiver > 1)
//         ) {
//           let findInTemp = await TEMPALERTMODEL.findOne({
//             shipmentId: mongoose.Types.ObjectId(obj._id),
//           });
//           if (findInTemp) {
//             let tempObj = {
//               FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
//               FAssetID: options.data.FObject[FobjectIndex].FAssetID,
//               FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
//               FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
//               FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
//               FLX: lightFlx,
//               FLatitude: options.data.FObject[FobjectIndex].FLatitude,
//               FLongitude: options.data.FObject[FobjectIndex].FLongitude,
//               FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
//               FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
//               type: 1,
//               status: "",
//               shipmentId: obj._id,
//             };
//             await ALARMMODEL.saveAlarm(tempObj);
//             await TEMPALERTMODEL.deleteMany({
//               shipmentId: mongoose.Types.ObjectId(obj._id),
//             });
//             let notobj = {
//               text:
//                 "Temperature is fluctuating for your shipment (" +
//                 obj.loadId +
//                 ")",
//               type: "alarm",
//               senderId: userData._id,
//               receiverId: obj.carrierId,
//               shipmentId: obj._id,
//               latitude: options.data.FObject[FobjectIndex].FLatitude,
//               longitude: options.data.FObject[FobjectIndex].FLongitude,
//               temperature: options.data.FObject[FobjectIndex].FTemperature1,
//             };
//             await NOTIFICATIONMODEL.saveNotification(notobj);
//             const result = await Mail.htmlFromatWithObject({
//               frontendUrl: frontendUrl,
//               emailTemplate: "alarm-alert",
//               // parsedData:parsedData,
//               data: obj,
//             });
//             const emailData = {
//               to: obj.carrierInfo.email,
//               subject: Mail.subjects.alarmAlert + "(" + obj.loadId + ")",
//               html: result.html,
//               templateId: "alarm-alert",
//             };
//             Mail.SENDEMAIL(emailData, function (err, res) {
//               if (err)
//                 console.log(
//                   "-----@@----- Error at sending verify mail to user -----@@-----",
//                   err
//                 );
//               else
//                 console.log(
//                   "-----@@----- Response at sending verify mail to user -----@@-----",
//                   res
//                 );
//             });
//           } else {
//             let tempObj = {
//               FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
//               FAssetID: options.data.FObject[FobjectIndex].FAssetID,
//               FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
//               FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
//               FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
//               FLX: lightFlx,
//               FLatitude: options.data.FObject[FobjectIndex].FLatitude,
//               FLongitude: options.data.FObject[FobjectIndex].FLongitude,
//               FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
//               FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
//               type: 1,
//               status: "",
//               shipmentId: obj._id,
//             };
//             await TEMPALERTMODEL.saveTemp(tempObj);
//           }
//           //  save in db
//         } else {
//           await TEMPALERTMODEL.deleteMany({
//             shipmentId: mongoose.Types.ObjectId(obj._id),
//           });
//         }
//         return obj;
//       })
//     );
//   } catch (err) {
//     console.log("in catch erro .....................", err);
//   }
// });

schedule.scheduleJob("*/5 * * * *", async () => {
  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken;

    let currentTimeStamp = _momentTimezone.default.utc().valueOf();

    let match = {
      isStart: true,
      isCompleted: false,
      isCancelled: false,
      isDeleted: false
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
    }, {
      $lookup: {
        from: "users",
        localField: "carrierId",
        foreignField: "_id",
        as: "carrierInfo"
      }
    }, {
      $unwind: "$carrierInfo"
    }];
    let shipmets = await _shipment.default.aggregate(query);
    let sensorIds = shipmets.map(function (e) {
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
    });
    shipmets = await Promise.all(shipmets.map(async (k, index) => {
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

      let distanceValue = await (0, _universal.getDistance)(obj.shipper[0].latitude, obj.shipper[0].longitude, options.data.FObject[FobjectIndex].FLatitude, options.data.FObject[FobjectIndex].FLongitude);
      let distanceValuereceiver = await (0, _universal.getDistance)(obj.receiver[0].latitude, obj.receiver[0].longitude, options.data.FObject[FobjectIndex].FLatitude, options.data.FObject[FobjectIndex].FLongitude);
      let lightFlx = JSON.parse(options.data.FObject[FobjectIndex].FExpandProto?.FDesc);
      lightFlx = lightFlx.fLx; // check for temperature
      // console.log('obj',obj)

      let alertCount = obj.tempAlertCount + 1;
      await _shipment.default.update({
        _id: _mongoose.default.Types.ObjectId(obj._id)
      }, {
        $set: {
          tempAlertCount: alertCount
        }
      });
      let tempObj = {
        FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
        FAssetID: options.data.FObject[FobjectIndex].FAssetID,
        FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
        FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
        FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
        FLX: lightFlx,
        FLatitude: options.data.FObject[FobjectIndex].FLatitude,
        FLongitude: options.data.FObject[FobjectIndex].FLongitude,
        FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
        FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
        type: 1,
        status: "",
        shipmentId: obj._id
      };
      await _tempAlert.default.saveTemp(tempObj);

      if (distanceValue > 3 && distanceValuereceiver > 3) {
        if (alertCount < 6) {
          // nothing will happen
          console.log("hhhhhh");
        }

        if (alertCount == 6) {
          console.log("herrrr in equal 6"); //check temp for all the last 6 entries

          let notData = await _tempAlert.default.find({
            shipmentId: _mongoose.default.Types.ObjectId(obj._id),
            type: 1
          }).sort({
            createdAt: -1
          }).limit(6);
          console.log("notDatanotData", notData);
          let newArray = notData.filter(function (el) {
            return el.FTemperature1 > obj.temperature.max || el.FTemperature1 < obj.temperature.min;
          });
          console.log("newArray-111", newArray); // return false;

          if (newArray.length == 0) {
            console.log("herrr1"); //no alert set temp count back to 0

            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(obj._id)
            }, {
              tempAlertCount: 0
            });
          }

          if (newArray.length > 0 && newArray.length < 6) {
            console.log("herrrr2");
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(obj._id)
            }, {
              tempAlertCount: 0
            });
          }

          if (newArray.length == 6) {
            console.log("herrrr3");
            await _shipment.default.findOneAndUpdate({
              _id: _mongoose.default.Types.ObjectId(obj._id)
            }, {
              tempAlertCount: 0
            });
            let tempObj = {
              FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
              FAssetID: options.data.FObject[FobjectIndex].FAssetID,
              FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
              FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
              FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
              FLX: lightFlx,
              FLatitude: options.data.FObject[FobjectIndex].FLatitude,
              FLongitude: options.data.FObject[FobjectIndex].FLongitude,
              FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
              FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
              type: 1,
              status: "",
              shipmentId: obj._id
            };
            await _alarm.default.saveAlarm(tempObj);
            let notobj = {
              text: "Temperature is fluctuating for your shipment (" + obj.loadId + ")",
              type: "alarm",
              senderId: userData._id,
              receiverId: obj.carrierId,
              shipmentId: obj._id,
              latitude: options.data.FObject[FobjectIndex].FLatitude,
              longitude: options.data.FObject[FobjectIndex].FLongitude,
              temperature: options.data.FObject[FobjectIndex].FTemperature1
            };
            await _notification.default.saveNotification(notobj);
            const result = await Mail.htmlFromatWithObject({
              frontendUrl: frontendUrl,
              emailTemplate: "alarm-alert",
              data: obj
            });
            const emailData = {
              to: obj.carrierInfo.email,
              subject: Mail.subjects.alarmAlert + "(" + obj.loadId + ")",
              html: result.html,
              templateId: "alarm-alert"
            };
            Mail.SENDEMAIL(emailData, function (err, res) {
              if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
            });
          }
        }

        if (alertCount > 6) {
          console.log("greater than 6");

          if (alertCount % 3 == 0) {
            console.log("in 3 divisible");
            let notData = await _tempAlert.default.find({
              shipmentId: _mongoose.default.Types.ObjectId(obj._id),
              type: 1
            }).sort({
              createdAt: -1
            }).limit(3);
            console.log("notData123", notData);
            let newArray = notData.filter(function (el) {
              return el.FTemperature1 > obj.temperature.max || el.FTemperature1 < obj.temperature.min;
            });
            console.log("newArray456", newArray);

            if (newArray.length == 0) {
              console.log("hhhh5666"); //no alert set temp count back to 0

              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(obj._id)
              }, {
                tempAlertCount: 0
              });
            }

            if (newArray.length > 0 && newArray.length < 3) {
              console.log("jhbjkbjk");
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(obj._id)
              }, {
                tempAlertCount: 0
              });
            }

            if (newArray.length == 3) {
              console.log("gjbjkoooooooooo");
              await _shipment.default.findOneAndUpdate({
                _id: _mongoose.default.Types.ObjectId(obj._id)
              }, {
                tempAlertCount: 0
              });
              let tempObj = {
                FAssetGUID: options.data.FObject[FobjectIndex].FAssetGUID,
                FAssetID: options.data.FObject[FobjectIndex].FAssetID,
                FHumidity1: options.data.FObject[FobjectIndex].FHumidity1,
                FGPSTime: options.data.FObject[FobjectIndex].FGPSTime,
                FTemperature1: options.data.FObject[FobjectIndex].FTemperature1,
                FLX: lightFlx,
                FLatitude: options.data.FObject[FobjectIndex].FLatitude,
                FLongitude: options.data.FObject[FobjectIndex].FLongitude,
                FVehicleGUID: options.data.FObject[FobjectIndex].FVehicleGUID,
                FVehicleName: options.data.FObject[FobjectIndex].FVehicleName,
                type: 1,
                status: "",
                shipmentId: obj._id
              };
              await _alarm.default.saveAlarm(tempObj);
              let notobj = {
                text: "Temperature is fluctuating for your shipment (" + obj.loadId + ")",
                type: "alarm",
                senderId: userData._id,
                receiverId: obj.carrierId,
                shipmentId: obj._id,
                latitude: options.data.FObject[FobjectIndex].FLatitude,
                longitude: options.data.FObject[FobjectIndex].FLongitude,
                temperature: options.data.FObject[FobjectIndex].FTemperature1
              };
              await _notification.default.saveNotification(notobj);
              const result = await Mail.htmlFromatWithObject({
                frontendUrl: frontendUrl,
                emailTemplate: "alarm-alert",
                data: obj
              });
              const emailData = {
                to: obj.carrierInfo.email,
                subject: Mail.subjects.alarmAlert + "(" + obj.loadId + ")",
                html: result.html,
                templateId: "alarm-alert"
              };
              Mail.SENDEMAIL(emailData, function (err, res) {
                if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
              });
            }
          }
        }
      }

      return obj;
    }));
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
schedule.scheduleJob("*/5 * * * *", async () => {
  console.log("in trailer model");

  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken; // let currentTimeStamp = moment.utc().valueOf();

    let match = {
      isActive: true,
      isDeleted: false
    };
    const query = [{
      $match: match
    }, {
      $lookup: {
        from: "sensors",
        localField: "sensorId",
        foreignField: "_id",
        as: "sensorData"
      }
    }, {
      $unwind: "$sensorData"
    }];
    let shipmets = await _trailer.default.aggregate(query);

    if (shipmets.length > 0) {
      for (let i = 0; i < shipmets.length; i++) {
        let dt1 = (0, _momentTimezone.default)().utc().format("YYYY-MM-DD HH:mm:ss");
        let dt2 = (0, _momentTimezone.default)().utc().subtract(5, "minutes");
        dt2 = dt2.format("YYYY-MM-DD HH:mm:ss");
        let options = await (0, _axios.default)({
          method: "post",
          url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            FTokenID: sensorToken,
            FAction: "QueryLBSTrackListByFGUID",
            FGUID: shipmets[i].sensorData.FGUID,
            FType: 1,
            FAssetTypeID: shipmets[i].sensorData.FAssetTypeID,
            FStartTime: dt2,
            FEndTime: dt1,
            // FLanguage: 0,
            FDateType: 1
          }
        });
        let finalData = await options.data.FObject.map(k => ({ ...k,
          Temp1: (0, _universal.chngTmpInF)(k.Temp1),
          //  shipmentId: shipmets[i]._id,
          trailerId: shipmets[i]._id,
          deviceId: shipmets[i].sensorId
        }));
        await _mapData.default.insertMany(finalData);
      }

      return true;
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});
schedule.scheduleJob("*/5 * * * *", async () => {
  console.log("in device model");

  try {
    let userData = await _user.default.findOne({
      role: 1
    });
    let sensorToken = userData.sensorToken; // let currentTimeStamp = moment.utc().valueOf();

    let match = {
      isActive: true,
      isDeleted: false
    };
    const query = [{
      $match: match
    }];
    let shipmets = await _sensor.default.aggregate(query);

    if (shipmets.length > 0) {
      for (let i = 0; i < shipmets.length; i++) {
        let dt1 = (0, _momentTimezone.default)().utc().format("YYYY-MM-DD HH:mm:ss");
        let dt2 = (0, _momentTimezone.default)().utc().subtract(5, "minutes");
        dt2 = dt2.format("YYYY-MM-DD HH:mm:ss");
        let options = await (0, _axios.default)({
          method: "post",
          url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
          headers: {
            "Content-Type": "application/json"
          },
          data: {
            FTokenID: sensorToken,
            FAction: "QueryLBSTrackListByFGUID",
            FGUID: shipmets[i].FGUID,
            FType: 1,
            FAssetTypeID: shipmets[i].FAssetTypeID,
            FStartTime: dt2,
            FEndTime: dt1,
            // FLanguage: 0,
            FDateType: 1
          }
        });
        let finalData = await options.data.FObject.map(k => ({ ...k,
          Temp1: (0, _universal.chngTmpInF)(k.Temp1),
          //  shipmentId: shipmets[i]._id,
          //  trailerId: shipmets[i]._id,
          deviceId: shipmets[i]._id
        }));
        await _deviceMapData.default.insertMany(finalData);
      }

      return true;
    }
  } catch (err) {
    console.log("in catch erro .....................", err);
  }
});