"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.downloadxls = exports.resetHour = exports.addEvent = exports.updateStatus = exports.getAllTrailer = exports.getDeviceMapData = exports.getMapData = exports.getDetail = exports.deleteTrailer = exports.edit = exports.save = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _trailer = _interopRequireDefault(require("../collections/trailer"));

var _user = _interopRequireDefault(require("../collections/user"));

var _shipment = _interopRequireDefault(require("../collections/shipment"));

var _history = _interopRequireDefault(require("../collections/history"));

var _mapData = _interopRequireDefault(require("../collections/mapData"));

var _deviceMapData = _interopRequireDefault(require("../collections/deviceMapData"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

var _axios = _interopRequireDefault(require("axios"));

var _moment = _interopRequireDefault(require("moment"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: trailer.js
 * @description: It Contain function layer for trailer service.
 * @author: Aditi Goel
 */
const imagePath = "./public/images/";
const videoPath = "./public/uploads/";

const {
  frontendUrl,
  logoUrl
} = _config.default.get("app");

var xl = require("excel4node");

/**
 *
 * @param {*} payload
 * @description - save trailer to db
 */

/********** Save trailer **********/
const save = async (user, payload) => {
  payload.carrierId = user.userId;
  let a = payload.unitNumber.slice(0, 2);

  if (a.toUpperCase() == "TR") {
    payload.unitNumber = payload.unitNumber;
  } else {
    payload.unitNumber = "TR" + payload.unitNumber;
  }

  let exist = await _trailer.default.findOne({
    sensorId: payload.sensorId,
    isDeleted: false,
    isActive: true
  });

  if (exist) {
    //return { status: 400 };
    let shipment = await _shipment.default.findOne({
      trailerId: exist._id
    });

    if (shipment && (shipment.isCancelled == false || shipment.isCompleted == false || shipment.isDeleted == false)) {
      return {
        status: 400
      };
    } else {
      let saveData = await _trailer.default.saveTrailer(payload);
      return saveData;
    }
  } else {
    let saveData = await _trailer.default.saveTrailer(payload);
    return saveData;
  }
};
/**
 *
 * @param {*} payload
 * @description - edit trailer to db
 */

/********** edit trailer **********/


exports.save = save;

const edit = async (user, payload) => {
  let a = payload.unitNumber.slice(0, 2);

  if (a.toUpperCase() == "TR") {
    payload.unitNumber = payload.unitNumber;
  } else {
    payload.unitNumber = "TR" + payload.unitNumber;
  }

  let exist = await _trailer.default.findOne({
    sensorId: payload.sensorId,
    isDeleted: false,
    isActive: true,
    _id: {
      $ne: _mongoose.default.Types.ObjectId(payload.id)
    }
  });

  if (exist) {
    let isSensorUsed = await _trailer.default.findOne({
      sensorId: payload.sensorId
    });

    if (isSensorUsed) {
      let shipment = await _shipment.default.findOne({
        trailerId: payload.id
      });

      if (shipment && (shipment.isCancelled == false || shipment.isCompleted == false || shipment.isDeleted == false)) {
        return {
          status: 400
        };
      } else {
        let saveData = await _trailer.default.update(payload);
        return saveData;
      }
    }
  } else {
    let saveData = await _trailer.default.update(payload);
    return saveData;
  }
};
/**
 *
 * @param {*} payload
 * @description - delete trailer to db
 */

/********** delete trailer **********/


exports.edit = edit;

const deleteTrailer = async payload => {
  payload.isDeleted = true;
  let saveData = await _trailer.default.update(payload);
  return true;
};
/**
 *
 * @param {*} payload
 * @description - get trailer detail to db
 */

/********** get trailer detail**********/


exports.deleteTrailer = deleteTrailer;

const getDetail = async (user, payload) => {
  console.log("payload.id", payload.id);
  let condition = {
    _id: _mongoose.default.Types.ObjectId(payload.id),
    isDeleted: false
  };
  let query = [{
    $match: condition
  }, {
    $lookup: {
      from: "manufactures",
      let: {
        id: "$manufacturer"
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
      as: "manufactureInfo"
    }
  }, {
    $unwind: {
      path: "$manufactureInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "sensors",
      localField: "sensorId",
      foreignField: "_id",
      as: "sensorData"
    }
  }, {
    $unwind: "$sensorData"
  }, {
    $lookup: {
      from: "shipments",
      let: {
        id: "$_id"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$trailerId", "$$id"]
            }, {
              $eq: ["$isCompleted", true]
            }, {
              $eq: ["$isDeleted", false]
            }, {
              $eq: ["$isStart", true]
            }]
          }
        }
      }],
      as: "completeShipment"
    }
  }, {
    $lookup: {
      from: "shipments",
      let: {
        id: "$_id"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$trailerId", "$$id"]
            }, {
              $eq: ["$isCompleted", false]
            }, {
              $eq: ["$isDeleted", false]
            }, {
              $eq: ["$isCancelled", false]
            }, {
              $eq: ["$isStart", true]
            }]
          }
        }
      }],
      as: "activeShipment"
    }
  }, {
    $unwind: {
      path: "$activeShipment",
      preserveNullAndEmptyArrays: true
    }
  }, // { $unwind: "$activeShipment" },
  {
    $lookup: {
      from: "historys",
      localField: "activeShipment._id",
      foreignField: "shipmentId",
      as: "historyData"
    }
  }];
  let saveData = await _trailer.default.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);
  //console.log("saveData", saveData);
  // return false;

  if (saveData[0]) {
    let sensorToken = "";

    if (user.role != 1) {
      let userData = await _user.default.findOne({
        role: 1
      });
      sensorToken = userData.sensorToken;
    } else {
      sensorToken = user.sensorToken;
    }

    let options = await (0, _axios.default)({
      method: "post",
      url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        FTokenID: sensorToken,
        FAction: "QueryLBSMonitorListByFGUIDs",
        FGUIDs: saveData[0].sensorData.FGUID,
        FType: 1
      }
    });
    let tempInF = options.data.FObject[0].FTemperature1 * 9 / 5 + 32;
    options.data.FObject[0].FTemperature1 = tempInF;
    saveData[0].realTimeData = options.data.FObject[0];

    if (saveData[0]?.activeShipment) {
      if (saveData[0].isStart == true) {
        saveData[0].coveredHours = await (0, _universal.getDistance)(saveData[0].activeShipment.shipper[0].latitude, saveData[0].activeShipment.shipper[0].longitude, options.data.FObject[0].FLatitude, options.data.FObject[0].FLongitude);
      } else {
        saveData[0].coveredHours = 0;
      }

      saveData[0].leftDistancePercentage = ((parseInt(saveData[0].activeShipment.totalDistance) - parseInt(saveData[0].coveredHours)) / parseInt(saveData[0].activeShipment.totalDistance) * 100).toFixed(2);
    } else {
      saveData[0].leftDistancePercentage = 0;
    }
  }

  return saveData;
};

exports.getDetail = getDetail;

const getMapData = async (user, payload) => {
  let currentDate = new Date();
  let pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - 6);
  let condition = {
    trailerId: _mongoose.default.Types.ObjectId(payload.id),
    createdAt: {
      $gte: pastDate,
      $lte: currentDate
    }
  };
  let query = [{
    $match: condition
  }];
  let saveData = await _mapData.default.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);

  return saveData;
};

exports.getMapData = getMapData;

const getDeviceMapData = async (user, payload) => {
  let currentDate = new Date();
  let pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - 6);
  let condition = {
    deviceId: _mongoose.default.Types.ObjectId(payload.id),
    createdAt: {
      $gte: pastDate,
      $lte: currentDate
    }
  };
  let query = [{
    $match: condition
  }];
  let saveData = await _deviceMapData.default.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);

  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - get all trailer list to db
 */

/********** get all trailer list**********/


exports.getDeviceMapData = getDeviceMapData;

const getAllTrailer = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false
  };

  if (user.role == 2) {
    matchObj = { ...matchObj,
      carrierId: _mongoose.default.Types.ObjectId(user.userId)
    };
  }

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = { ...matchObj,
      $or: [{
        unitNumber: {
          $regex: regex
        }
      }]
    };
  }

  let query = [{
    $match: matchObj
  }, {
    $lookup: {
      from: "manufactures",
      let: {
        id: "$manufacturer"
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
      as: "manufactureInfo"
    }
  }, {
    $unwind: {
      path: "$manufactureInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $lookup: {
      from: "users",
      let: {
        id: "$carrierId"
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
      as: "carrierInfo"
    }
  }, {
    $unwind: {
      path: "$carrierInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _trailer.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let trailerList = await _trailer.default.aggregate(query);
  return {
    data: trailerList,
    total: total
  };
};

exports.getAllTrailer = getAllTrailer;

const updateStatus = async (user, payload) => {
  let saveData = await _trailer.default.update(payload);
  return saveData;
};

exports.updateStatus = updateStatus;

const addEvent = async (user, payload) => {
  let eventObj = {
    status: payload.status,
    comments: payload.comment,
    amount: payload.amount,
    createTime: _moment.default.utc()
  };
  let saveData = await _trailer.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.trailerId)
  }, {
    $push: {
      timeline: eventObj
    }
  }, {
    new: true
  });
  return saveData;
};

exports.addEvent = addEvent;

const resetHour = async (user, payload) => {
  let trailerData = await _trailer.default.findOne({
    _id: payload.id
  }); // let engineHours = trailerData.engineHours + payload.engineHours;

  await _trailer.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(trailerData._id)
  }, {
    $set: {
      engineHours: payload.engineHours,
      currentHours: 0
    }
  });
  return true;
};

exports.resetHour = resetHour;

const downloadxls = async (user, payload) => {
  return new Promise(async resolve => {
    await setTimeout(async () => {
      let currentDate = new Date();
      let pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 6);
      let condition = {
        trailerId: _mongoose.default.Types.ObjectId(payload.id),
        createdAt: {
          $gte: pastDate,
          $lte: currentDate
        }
      };
      let historyData = await _mapData.default.find({
        trailerId: _mongoose.default.Types.ObjectId(payload.id),
        createdAt: {
          $gte: pastDate,
          $lte: currentDate
        }
      }, {
        _id: 0,
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
      ws.cell(1, 17).string("Temp2").style(style);
      let fileName = `${Date.now()}-${payload.id}`;
      fileName = fileName + "-trailer.xlsx";
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
        let fileData = await (0, _universal.uploadFile)(fileType, src, "trailer-report/" + fileName);
        resolve(fileData);
      }, 8000);
    }, 6000);
  });
};

exports.downloadxls = downloadxls;