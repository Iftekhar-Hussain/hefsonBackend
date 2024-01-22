/*
 * @file: universal.js
 * @description: It Contain function layer for all commom function.
 * @author: Aditi Goel
 */
import md5 from "md5";
import jwt from "jsonwebtoken";
import config from "config";
import { failAction } from "./response";
import Message from "./messages";
import axios from "axios";
import USERMODEL from "./../collections/user";
//import SUBCRIPTIONMODEL from "./../collections/subscription"
import mongoose from "mongoose";
const { jwtAlgo, jwtKey } = config.get("app");
import timezone from "node-google-timezone";
timezone.key("AIzaSyDS-4ySJ5GMvHVmQW59zVIUw9jMLjYNUW4");
import moment from "moment-timezone";
//require('moment-timezone');

/**************  Upload Image File by Ankit Kumar Gautam ***************/

import path from "path";
var fs = require("fs");
const s3config = config.get("s3");
const AWS = require("aws-sdk");

AWS.config = {
  accessKeyId: s3config.accessKeyId,
  secretAccessKey: s3config.secretAccessKey,
  region: s3config.region,
  bucketName: s3config.bucketName,
};
var Bucket = s3config.bucketName;
var photoBucket = new AWS.S3({
  credentials: AWS.config,
  params: {
    Bucket,
  },
});

export const uploadFile = async (myFile, pathLocation, fileTitle) => {
  return new Promise(async (resolve, reject) => {
    var buffer = await fs.createReadStream(pathLocation);
    await photoBucket.upload(
      {
        Key: fileTitle,
        ContentType: myFile.mimetype || "image/png",
        Body: buffer,
        ACL: "public-read",
      },
      async (err, data) => {
        if (err) {
          await unlinkFileUpload(pathLocation);
          reject(err);
        } else {
          await unlinkFileUpload(pathLocation);
          resolve(data.Location); //data is image url
        }
      }
    );
  });
};

export const unlinkFileUpload = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.unlink(path.resolve(filePath), function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};

/*************************************************/

export const getTimeStamp = () => {
  return Date.now();
};

export const chngTmpInF = (temp) => {
  let tempInF = (temp * 9) / 5 + 32;
  return tempInF;
};

export const dateConvertTimeStamp = (date, time) => {
  const dateStr = date;
  const timeStr = time;
  const combinedStr = `${dateStr} ${timeStr}`;

  const formattedUtcDateTime = moment.tz(
    combinedStr,
    "YYYY-MM-DD HH:mm",
    "Asia/Kolkata"
  );

  return formattedUtcDateTime;
};

export const convertToActualDate = (date, time, timezoneId) => {
  const dateStr = date;
  const timeStr = time;
  const combinedStr = `${dateStr} ${timeStr}`;

  const sourceDateTime = moment.tz(combinedStr, "YYYY-MM-DD HH:mm", timezoneId);
  return sourceDateTime;
};

export const getOffsetFromAddress = (lat, lng, timestamp, fn) => {
  //let d =  timezone.data(lat, lng, timestamp);
  timezone.data(lat, lng, timestamp, function (err, tz) {
    fn(tz.raw_response);
  });
};
// password encryption.
export const encryptpassword = (password) => {
  return md5(password);
};
// Generate random strings.
export const generateRandom = (length, alphanumeric) => {
  let data = "",
    keys = "";

  if (alphanumeric) {
    keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz@!$*";
  } else {
    keys = "0123456789";
  }

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }
  return data;
};

export const randomToken = (value) => {
  const valueWithTimeStamp = value + Date.now();

  return md5(valueWithTimeStamp);
};

// Genrate image random name
export const generateImageRandom = (length = 32) => {
  let data = "",
    keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-";
  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }
  return data;
};

/*********** Generate JWT token *************/
export const generateToken = (data) =>
  jwt.sign(data, jwtKey, { algorithm: jwtAlgo, expiresIn: "90d" });
/*********** Decode JWT token *************/
export const decodeToken = (token) => jwt.verify(token, jwtKey);

/*********** Verify token *************/
export const checkTokenAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await USERMODEL.checkToken(token);

  if (user && (user.role == 1 || user.role == 4)) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/*********** Verify Fan token *************/
export const checkTokenFan = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await USERMODEL.checkToken(token);
  if (user && user.role == 2) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/*********** Verify token *************/
export const checkToken = async (req, res, next) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"];
    let decoded = {};
    try {
      decoded = jwt.verify(token, jwtKey);
    } catch (err) {
      return res.status(401).json(failAction(Message.tokenExpired, 401));
    }
    const user = await USERMODEL.checkToken(token);
    if (
      user &&
      (user.role == 2 || user.role == 3 || user.role == 1 || user.role == 4)
    ) {
      req.user = { ...decoded, token };
      next();
    } else {
      res.status(401).json(failAction(Message.unauthorizedUser, 401));
    }
  } else {
    next();
  }
};

/*********** Verify celebrity token *************/
export const checkTokenCelebrity = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await USERMODEL.checkToken(token);
  if (user && user.role == 3) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/*********** Verify all type user token *************/
export const checkTokenCommon = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await USERMODEL.checkToken(token);
  if (user) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/*********** Verify token for celebrity & admin *************/
export const checkTokenForCelebrityAndAdmin = async (req, res, next) => {
  console.log(req.query);
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await USERMODEL.checkToken(token);
  if (
    (user && user.role == 3) ||
    (user && user.role == 1) ||
    (user && user.role == 4)
  ) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/*********** Verify token for celebrity & fan *************/
export const checkTokenForCelebrityAndFan = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};
  try {
    decoded = jwt.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json(failAction(Message.tokenExpired, 401));
  }
  const user = await USERMODEL.checkToken(token);
  if ((user && user.role == 3) || (user && user.role == 2)) {
    req.user = { ...decoded, token };
    next();
  } else {
    res.status(401).json(failAction(Message.unauthorizedUser, 401));
  }
};

/*********** check memeber subcription token *************/
export const checkMemberSubcription = async (req, res, next) => {
  // const userSubscrption = await SUBCRIPTIONMODEL.checksubcription(req.user.userId)

  const user = await USERMODEL.findone({
    _id: mongoose.Types.ObjectId(req.user.userId),
  });

  if (user && user.isSubscribed) {
    next();
  } else {
    res.status(200).json(failAction(Message.unSubscribedUser, 402));
  }
};

// get distance between two coordinates
// export const getDistance = (lat1, lng1, lat2, lng2) => {
//   var R = 6371; // Radius of the earth in km
//   var dLat = deg2rad(lat2 - lat1); // deg2rad below
//   var dLon = deg2rad(lng2 - lng1);
//   var a =
//     Math.sin(dLat / 2) * Math.sin(dLat / 2) +
//     Math.cos(deg2rad(lat1)) *
//       Math.cos(deg2rad(lat2)) *
//       Math.sin(dLon / 2) *
//       Math.sin(dLon / 2);
//   var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
//   var d = R * c; // Distance in km
//   var distanceInMile = d * 0.62137119;
//   return distanceInMile;
// };

export const getDistance = async (lat1, lng1, lat2, lng2) => {
  const Location1Str = lat1 + "," + lng1;
  const Location2Str = lat2 + "," + lng2;
  const GOOGLE_API_KEY = "AIzaSyDS-4ySJ5GMvHVmQW59zVIUw9jMLjYNUW4";

  let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";

  let params = `origins=${Location1Str}&destinations=${Location2Str}&key=${GOOGLE_API_KEY}`; // you need to get a key
  let finalApiURL = `${ApiURL}${encodeURI(params)}`;

  // let fetchResult = await fetch(finalApiURL); // call API
  // let Result = await fetchResult.json(); // extract json
  let fetchResult = await axios.get(finalApiURL)
  console.log(
    "Result",
    fetchResult.data.rows[0].elements[0].distance.text
  );
  var distanceInMile = (fetchResult.data.rows[0].elements[0].distance.value / 1000) * 0.62137119;
  console.log('distanceInMile',distanceInMile)
  distanceInMile = (distanceInMile).toFixed(2);
   console.log('distanceInMile',distanceInMile)
 // return false;
  return distanceInMile;
 // return Result.rows[0].elements[0].distance;
};

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

export const diff_hours = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};
