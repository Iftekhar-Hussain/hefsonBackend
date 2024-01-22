/*
 * @file: device.js
 * @description: It Contain function layer for device service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import DEVICEMODEL from "../collections/device";
import SENSORMODEL from "../collections/sensor";
import USERMODEL from "../collections/user";
import DEVICEMAPMODEL from "../collections/deviceMapData";
import Message from "../utilities/messages";
import fs from "fs";
import {
  encryptpassword,
  generateToken,
  generateRandom,
  getTimeStamp,
  getDistance,
  randomToken,
} from "../utilities/universal";
import path from "path";
const imagePath = "./public/imagels/";
const videoPath = "./public/uploads/";
import config from "config";
const { frontendUrl, logoUrl } = config.get("app");
const moment = require("moment");
import axios from "axios";
var xl = require("excel4node");
import { uploadFile } from "../utilities/universal";

/**
 *
 * @param {*} payload
 * @description - get all device list to db
 */
/********** get all list**********/
export const list = async (user, payload) => {
  let sensorToken = "";
  if (user.role != 1) {
    let userData = await USERMODEL.findOne({ role: 1 });
    sensorToken = userData.sensorToken;
  } else {
    sensorToken = user.sensorToken;
  }
  let options = await axios({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/Admin",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      FTokenID: sensorToken,
      FAction: "QueryAdminVehicleList",
    },
  });
  let finalDataArr = [];
  for (let data of options.data.FObject) {
    let dataExist = await SENSORMODEL.findOne({ FGUID: data.FGUID });
    if (!dataExist) {
      finalDataArr.push(data);
    }
  }
  if (finalDataArr.length) {
    await SENSORMODEL.saveManySensor(finalDataArr);
  }

  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false, isActive: true };

  if (user.role == 2) {
    matchObj = { ...matchObj, userId: mongoose.Types.ObjectId(user.userId) };
  }

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [
        { FVehicleName: { $regex: regex } },
        { FAssetID: { $regex: regex } },
      ],
    };
  }

  let query = [
    {
      $match: matchObj,
    },
    {
      $lookup: {
        from: "trailers",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [
                  { $eq: ["$sensorId", "$$id"] },
                  { $eq: ["$isDeleted", false] },
                ],
              },
            },
          },
        ],
        as: "trailerData",
      },
    },
    { $unwind: { path: "$trailerData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "users",
        localField: "userId",
        foreignField: "_id",
        as: "userData",
      },
    },
    { $unwind: { path: "$userData", preserveNullAndEmptyArrays: true } },
    {
      $lookup: {
        from: "shipments",
        let: { id: "$trailerData._id" },
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
        as: "shipmentData",
      },
    },
    { $unwind: { path: "$shipmentData", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await SENSORMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let sensorList = await SENSORMODEL.aggregate(query);
  // console.log("sensorList", sensorList);
  // return false;
  let sensorIds = sensorList
    .map(function (e) {
      return e.FGUID;
    })
    .join(",");
  //console.log("sensorIds", sensorIds);

  let options1 = await axios({
    method: "post",
    url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
    headers: {
      "Content-Type": "application/json",
    },
    data: {
      FTokenID: sensorToken,
      FAction: "QueryLBSMonitorListByFGUIDs",
      FGUIDs: sensorIds,
      FType: 1,
    },
  });

  sensorList = sensorList.map((k, index) => {
    let obj = { ...k };
    let FobjectIndex = options1.data.FObject.findIndex(
      (itm) => itm.FAssetID == obj.FAssetID
    );

    let tempInF =
      (options1.data.FObject[FobjectIndex].FTemperature1 * 9) / 5 + 32;
    options1.data.FObject[FobjectIndex].FTemperature1 = tempInF;

    if (FobjectIndex != -1) {
      obj["realTimeData"] = options1.data.FObject[FobjectIndex];
    } else {
      obj["realTimeData"] = {};
    }
    return obj;
  });
  // let i = 0;
  // for (let data of sensorList) {
  // let options = await axios({
  //   method: "post",
  //   url: "http://icloud.assetscontrols.com:8092/OpenApi/LBS",
  //   headers: {
  //     "Content-Type": "application/json",
  //   },
  //   data: {
  //     FTokenID: sensorToken,
  //     FAction: "QueryLBSMonitorListByFGUIDs",
  //     FGUIDs: data.FGUID,
  //     FType: 1,
  //   },
  // });
  //   let tempInF = (options.data.FObject[0].FTemperature1 * 9) / 5 + 32;
  //   options.data.FObject[0].FTemperature1 = tempInF;
  //   sensorList[i].realTimeData = options.data.FObject[0];
  //   i++;
  // }

  return {
    data: sensorList,
    total: total,
  };
};

export const getDetail = async (user, payload) => {
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
        from: "trailers",
        localField: "_id",
        foreignField: "sensorId",
        as: "trailerData",
      },
    },
    {
      $unwind: {
        path: "$trailerData",
        preserveNullAndEmptyArrays: true,
      },
    },
    //  { $unwind: "$trailerData" },
    {
      $lookup: {
        from: "manufactures",
        localField: "trailerData.manufacturer",
        foreignField: "_id",
        as: "trailerData.manuData",
      },
    },
    {
      $unwind: {
        path: "$trailerData.manuData",
        preserveNullAndEmptyArrays: true,
      },
    },
    //{ $unwind: "$trailerData.manuData" },
    {
      $lookup: {
        from: "shipments",
        let: { id: "$trailerData._id" },
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
    // {
    //   $unwind: {
    //   //  path: "$completeShipment",
    //     preserveNullAndEmptyArrays: true
    //   }
    // },
    {
      $lookup: {
        from: "shipments",
        let: { id: "$trailerData._id" },
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
    {
      $lookup: {
        from: "historys",
        localField: "activeShipment._id",
        foreignField: "shipmentId",
        as: "historyData",
      },
    },
    {
      $sort: { "activeShipment.createdAt": -1 },
    },
  ];

  let saveData = await SENSORMODEL.aggregate(query);
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
      FGUIDs: saveData[0].FGUID,
      FType: 1,
    },
  });
  let tempInF = (options.data.FObject[0].FTemperature1 * 9) / 5 + 32;
  options.data.FObject[0].FTemperature1 = tempInF;
  saveData[0].realTimeData = options.data.FObject[0];
  saveData[0].coveredHours = 0;
  saveData[0].leftDistancePercentage = 0;
  if (saveData[0].activeShipment || saveData[0].activeShipment != undefined) {
    saveData[0].coveredHours = await getDistance(
      saveData[0].activeShipment.shipper[0].latitude,
      saveData[0].activeShipment.shipper[0].longitude,
      options.data.FObject[0].FLatitude,
      options.data.FObject[0].FLongitude
    );
    saveData[0].leftDistancePercentage = (
      ((parseInt(saveData[0].activeShipment.totalDistance) -
        parseInt(saveData[0].coveredHours)) /
        parseInt(saveData[0].activeShipment.totalDistance)) *
      100
    ).toFixed(2);
  }

  return saveData;
};

export const assignSensor = async (user, payload) => {
  await SENSORMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(payload.sensorId) },
    {
      $set: {
        userId: payload.userId,
      },
    }
  );
};

export const downloadxls = async (user, payload) => {
  return new Promise(async (resolve) => {
    await setTimeout(async () => {
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

      let historyData = await DEVICEMAPMODEL.find(
        {
          deviceId: mongoose.Types.ObjectId(payload.id),
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
      fileName = fileName + "-device.xlsx";
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
          "device-report/" + fileName
        );
        resolve(fileData);
      }, 8000);
    }, 6000);
  });
};
