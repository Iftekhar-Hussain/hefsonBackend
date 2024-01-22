/*
 * @file: trailer.js
 * @description: It Contain function layer for trailer service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import TRAILERMODEL from "../collections/trailer";
import USERMODEL from "../collections/user";
import SHIPMENTMODEL from "../collections/shipment";
import HISTORYMODEL from "../collections/history";
import MAPDATAMODEL from "../collections/mapData";
import DEVICEMAPDATAMODEL from "../collections/deviceMapData";
import Message from "../utilities/messages";
import fs from "fs";
import {
  encryptpassword,
  generateToken,
  generateRandom,
  getTimeStamp,
  randomToken,
  getDistance,
  diff_hours,
} from "../utilities/universal";
import path from "path";
const imagePath = "./public/images/";
const videoPath = "./public/uploads/";
import config from "config";
const { frontendUrl, logoUrl } = config.get("app");
import axios from "axios";
import moment from "moment";
var xl = require("excel4node");
import { uploadFile } from "../utilities/universal";

/**
 *
 * @param {*} payload
 * @description - save trailer to db
 */
/********** Save trailer **********/
export const save = async (user, payload) => {
  payload.carrierId = user.userId;
  let a = payload.unitNumber.slice(0, 2);
  if (a.toUpperCase() == "TR") {
    payload.unitNumber = payload.unitNumber;
  } else {
    payload.unitNumber = "TR" + payload.unitNumber;
  }

  let exist = await TRAILERMODEL.findOne({
    sensorId: payload.sensorId,
    isDeleted: false,
    isActive: true,
  });
  if (exist) {
    //return { status: 400 };
    let shipment = await SHIPMENTMODEL.findOne({ trailerId: exist._id });
    if (
      shipment &&
      (shipment.isCancelled == false ||
        shipment.isCompleted == false ||
        shipment.isDeleted == false)
    ) {
      return { status: 400 };
    } else {
      let saveData = await TRAILERMODEL.saveTrailer(payload);

      return saveData;
    }
  } else {
    let saveData = await TRAILERMODEL.saveTrailer(payload);

    return saveData;
  }
};

/**
 *
 * @param {*} payload
 * @description - edit trailer to db
 */
/********** edit trailer **********/
export const edit = async (user, payload) => {
  let a = payload.unitNumber.slice(0, 2);
  if (a.toUpperCase() == "TR") {
    payload.unitNumber = payload.unitNumber;
  } else {
    payload.unitNumber = "TR" + payload.unitNumber;
  }
  let exist = await TRAILERMODEL.findOne({
    sensorId: payload.sensorId,
    isDeleted: false,
    isActive: true,
    _id: { $ne: mongoose.Types.ObjectId(payload.id) },
  });

  if (exist) {
    let isSensorUsed = await TRAILERMODEL.findOne({
      sensorId: payload.sensorId,
    });
    if (isSensorUsed) {
      let shipment = await SHIPMENTMODEL.findOne({ trailerId: payload.id });
      if (
        shipment &&
        (shipment.isCancelled == false ||
          shipment.isCompleted == false ||
          shipment.isDeleted == false)
      ) {
        return { status: 400 };
      } else {
        let saveData = await TRAILERMODEL.update(payload);

        return saveData;
      }
    }
  } else {
    let saveData = await TRAILERMODEL.update(payload);

    return saveData;
  }
};

/**
 *
 * @param {*} payload
 * @description - delete trailer to db
 */
/********** delete trailer **********/
export const deleteTrailer = async (payload) => {
  payload.isDeleted = true;
  let saveData = await TRAILERMODEL.update(payload);

  return true;
};

/**
 *
 * @param {*} payload
 * @description - get trailer detail to db
 */
/********** get trailer detail**********/
export const getDetail = async (user, payload) => {
  console.log("payload.id", payload.id);
  let condition = {
    _id: mongoose.Types.ObjectId(payload.id),
    isDeleted: false,
  };

  let query = [
    {
      $match: condition,
    },
    {
      $lookup: {
        from: "manufactures",
        let: { id: "$manufacturer" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$id"] }],
              },
            },
          },
        ],
        as: "manufactureInfo",
      },
    },
    { $unwind: { path: "$manufactureInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "sensors",
        localField: "sensorId",
        foreignField: "_id",
        as: "sensorData",
      },
    },
    { $unwind: "$sensorData" },
    {
      $lookup: {
        from: "shipments",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$trailerId", "$$id"],
                  },
                  {
                    $eq: ["$isCompleted", true],
                  },
                  {
                    $eq: ["$isDeleted", false],
                  },
                  {
                    $eq: ["$isStart", true],
                  },
                ],
              },
            },
          },
        ],
        as: "completeShipment",
      },
    },
    {
      $lookup: {
        from: "shipments",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  {
                    $eq: ["$trailerId", "$$id"],
                  },
                  {
                    $eq: ["$isCompleted", false],
                  },
                  {
                    $eq: ["$isDeleted", false],
                  },
                  {
                    $eq: ["$isCancelled", false],
                  },
                  {
                    $eq: ["$isStart", true],
                  },
                ],
              },
            },
          },
        ],
        as: "activeShipment",
      },
    },
    { $unwind: { path: "$activeShipment", preserveNullAndEmptyArrays: true } },
    // { $unwind: "$activeShipment" },
    {
      $lookup: {
        from: "historys",
        localField: "activeShipment._id",
        foreignField: "shipmentId",
        as: "historyData",
      },
    },
  ];

  let saveData = await TRAILERMODEL.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);
  //console.log("saveData", saveData);
  // return false;

  if (saveData[0]) {
    let sensorToken = "";
    if (user.role != 1) {
      let userData = await USERMODEL.findOne({ role: 1 });
      sensorToken = userData.sensorToken;
    } else {
      sensorToken = user.sensorToken;
    }

    let options = await axios({
      method: "post",
      url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        FTokenID: sensorToken,
        FAction: "QueryLBSMonitorListByFGUIDs",
        FGUIDs: saveData[0].sensorData.FGUID,
        FType: 1,
      },
    });

    let tempInF = (options.data.FObject[0].FTemperature1 * 9) / 5 + 32;
    options.data.FObject[0].FTemperature1 = tempInF;
    saveData[0].realTimeData = options.data.FObject[0];

    if (saveData[0]?.activeShipment) {
      if (saveData[0].isStart == true) {
        saveData[0].coveredHours = await getDistance(
          saveData[0].activeShipment.shipper[0].latitude,
          saveData[0].activeShipment.shipper[0].longitude,
          options.data.FObject[0].FLatitude,
          options.data.FObject[0].FLongitude
        );
      } else {
        saveData[0].coveredHours = 0;
      }

      saveData[0].leftDistancePercentage = (
        ((parseInt(saveData[0].activeShipment.totalDistance) -
          parseInt(saveData[0].coveredHours)) /
          parseInt(saveData[0].activeShipment.totalDistance)) *
        100
      ).toFixed(2);
    } else {
      saveData[0].leftDistancePercentage = 0;
    }
  }
  return saveData;
};

export const getMapData = async (user, payload) => {
  let currentDate = new Date();
  let pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - 6);
  let condition = {
    trailerId: mongoose.Types.ObjectId(payload.id),
    createdAt: {
      $gte: pastDate,
      $lte: currentDate,
    },
  };

  let query = [
    {
      $match: condition,
    },
  ];

  let saveData = await MAPDATAMODEL.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);

  return saveData;
};

export const getDeviceMapData = async (user, payload) => {
  let currentDate = new Date();
  let pastDate = new Date();
  pastDate.setMonth(pastDate.getMonth() - 6);
  let condition = {
    deviceId: mongoose.Types.ObjectId(payload.id),
    createdAt: {
      $gte: pastDate,
      $lte: currentDate,
    },
  };

  let query = [
    {
      $match: condition,
    },
  ];

  let saveData = await DEVICEMAPDATAMODEL.aggregate(query); //await TRUCKMODEL.findOneByCondition(condition);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - get all trailer list to db
 */
/********** get all trailer list**********/
export const getAllTrailer = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false };

  if (user.role == 2) {
    matchObj = {
      ...matchObj,
      carrierId: mongoose.Types.ObjectId(user.userId),
    };
  }
  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [{ unitNumber: { $regex: regex } }],
    };
  }

  let query = [
    {
      $match: matchObj,
    },
    {
      $lookup: {
        from: "manufactures",
        let: { id: "$manufacturer" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$id"] }],
              },
            },
          },
        ],
        as: "manufactureInfo",
      },
    },
    { $unwind: { path: "$manufactureInfo", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        let: { id: "$carrierId" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$_id", "$$id"] }],
              },
            },
          },
        ],
        as: "carrierInfo",
      },
    },
    { $unwind: { path: "$carrierInfo", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await TRAILERMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let trailerList = await TRAILERMODEL.aggregate(query);
  return {
    data: trailerList,
    total: total,
  };
};

export const updateStatus = async (user, payload) => {
  let saveData = await TRAILERMODEL.update(payload);

  return saveData;
};

export const addEvent = async (user, payload) => {
  let eventObj = {
    status: payload.status,
    comments: payload.comment,
    amount: payload.amount,
    createTime: moment.utc(),
  };
  let saveData = await TRAILERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(payload.trailerId) },
    {
      $push: {
        timeline: eventObj,
      },
    },
    { new: true }
  );

  return saveData;
};

export const resetHour = async (user, payload) => {
  let trailerData = await TRAILERMODEL.findOne({ _id: payload.id });
  // let engineHours = trailerData.engineHours + payload.engineHours;
  await TRAILERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(trailerData._id) },
    {
      $set: {
        engineHours: payload.engineHours,
        currentHours: 0,
      },
    }
  );
  return true;
};

export const downloadxls = async (user, payload) => {
  return new Promise(async (resolve) => {
    await setTimeout(async () => {
      let currentDate = new Date();
      let pastDate = new Date();
      pastDate.setMonth(pastDate.getMonth() - 6);
      let condition = {
        trailerId: mongoose.Types.ObjectId(payload.id),
        createdAt: {
          $gte: pastDate,
          $lte: currentDate,
        },
      };

      let historyData = await MAPDATAMODEL.find(
        {
          trailerId: mongoose.Types.ObjectId(payload.id),
          createdAt: {
            $gte: pastDate,
            $lte: currentDate,
          },
        },
        {
          _id: 0,
          updatedAt: 0,
          __v: 0,
        }
      );

      let wb = new xl.Workbook();
      let stringStyle = wb.createStyle({
        size: 12,
      });
      let style = wb.createStyle({
        font: {
          size: 12,
          bold: true,
        },
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
      await Promise.all(
        await historyData.map((todo, k) => {
          ws.cell(row + k, 1)
            .string(todo.Bat.toString())
            .style(stringStyle);
          ws.cell(row + k, 2)
            .string(todo.CID.toString())
            .style(stringStyle);
          ws.cell(row + k, 3)
            .string(todo.Dir.toString())
            .style(stringStyle);
          ws.cell(row + k, 4)
            .string(todo.GT.toString())
            .style(stringStyle);
          ws.cell(row + k, 5)
            .string(todo.Hum1.toString())
            .style(stringStyle);
          ws.cell(row + k, 6)
            .string(todo.Hum2.toString())
            .style(stringStyle);
          ws.cell(row + k, 7)
            .string(todo.LAC.toString())
            .style(stringStyle);
          ws.cell(row + k, 8)
            .string(todo.LType.toString())
            .style(stringStyle);
          ws.cell(row + k, 9)
            .string(todo.Lat.toString())
            .style(stringStyle);
          ws.cell(row + k, 10)
            .string(todo.Lon.toString())
            .style(stringStyle);
          ws.cell(row + k, 11)
            .string(todo.MCC.toString())
            .style(stringStyle);
          ws.cell(row + k, 12)
            .string(todo.MNC.toString())
            .style(stringStyle);
          ws.cell(row + k, 13)
            .string(todo.Mil.toString())
            .style(stringStyle);
          ws.cell(row + k, 14)
            .string(todo.RT.toString())
            .style(stringStyle);
          ws.cell(row + k, 15)
            .string(todo.Speed.toString())
            .style(stringStyle);
          ws.cell(row + k, 16)
            .string(todo.Temp1.toString())
            .style(stringStyle);
          ws.cell(row + k, 17)
            .string(todo.Temp2.toString())
            .style(stringStyle);
        })
      );
      await wb.write(src);
      await setTimeout(async () => {
        let fileType = {
          mimetype:
            "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
        };

        let fileData = await uploadFile(
          fileType,
          src,
          "trailer-report/" + fileName
        );
        resolve(fileData);
      }, 8000);
    }, 6000);
  });
};
