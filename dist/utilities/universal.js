"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.diff_hours = exports.getDistance = exports.checkMemberSubcription = exports.checkTokenForCelebrityAndFan = exports.checkTokenForCelebrityAndAdmin = exports.checkTokenCommon = exports.checkTokenCelebrity = exports.checkToken = exports.checkTokenFan = exports.checkTokenAdmin = exports.decodeToken = exports.generateToken = exports.generateImageRandom = exports.randomToken = exports.generateRandom = exports.encryptpassword = exports.getOffsetFromAddress = exports.convertToActualDate = exports.dateConvertTimeStamp = exports.chngTmpInF = exports.getTimeStamp = exports.unlinkFileUpload = exports.uploadFile = void 0;

var _md = _interopRequireDefault(require("md5"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _config = _interopRequireDefault(require("config"));

var _response = require("./response");

var _messages = _interopRequireDefault(require("./messages"));

var _axios = _interopRequireDefault(require("axios"));

var _user = _interopRequireDefault(require("./../collections/user"));

var _mongoose = _interopRequireDefault(require("mongoose"));

var _nodeGoogleTimezone = _interopRequireDefault(require("node-google-timezone"));

var _momentTimezone = _interopRequireDefault(require("moment-timezone"));

var _path = _interopRequireDefault(require("path"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: universal.js
 * @description: It Contain function layer for all commom function.
 * @author: Aditi Goel
 */
//import SUBCRIPTIONMODEL from "./../collections/subscription"
const {
  jwtAlgo,
  jwtKey
} = _config.default.get("app");

_nodeGoogleTimezone.default.key("AIzaSyDS-4ySJ5GMvHVmQW59zVIUw9jMLjYNUW4");

var fs = require("fs");

const s3config = _config.default.get("s3");

const AWS = require("aws-sdk");

AWS.config = {
  accessKeyId: s3config.accessKeyId,
  secretAccessKey: s3config.secretAccessKey,
  region: s3config.region,
  bucketName: s3config.bucketName
};
var Bucket = s3config.bucketName;
var photoBucket = new AWS.S3({
  credentials: AWS.config,
  params: {
    Bucket
  }
});

const uploadFile = async (myFile, pathLocation, fileTitle) => {
  return new Promise(async (resolve, reject) => {
    var buffer = await fs.createReadStream(pathLocation);
    await photoBucket.upload({
      Key: fileTitle,
      ContentType: myFile.mimetype || "image/png",
      Body: buffer,
      ACL: "public-read"
    }, async (err, data) => {
      if (err) {
        await unlinkFileUpload(pathLocation);
        reject(err);
      } else {
        await unlinkFileUpload(pathLocation);
        resolve(data.Location); //data is image url
      }
    });
  });
};

exports.uploadFile = uploadFile;

const unlinkFileUpload = function (filePath) {
  return new Promise(function (resolve, reject) {
    fs.unlink(_path.default.resolve(filePath), function (err) {
      if (err) {
        reject(err);
      } else {
        resolve(true);
      }
    });
  });
};
/*************************************************/


exports.unlinkFileUpload = unlinkFileUpload;

const getTimeStamp = () => {
  return Date.now();
};

exports.getTimeStamp = getTimeStamp;

const chngTmpInF = temp => {
  let tempInF = temp * 9 / 5 + 32;
  return tempInF;
};

exports.chngTmpInF = chngTmpInF;

const dateConvertTimeStamp = (date, time) => {
  const dateStr = date;
  const timeStr = time;
  const combinedStr = `${dateStr} ${timeStr}`;

  const formattedUtcDateTime = _momentTimezone.default.tz(combinedStr, "YYYY-MM-DD HH:mm", "Asia/Kolkata");

  return formattedUtcDateTime;
};

exports.dateConvertTimeStamp = dateConvertTimeStamp;

const convertToActualDate = (date, time, timezoneId) => {
  const dateStr = date;
  const timeStr = time;
  const combinedStr = `${dateStr} ${timeStr}`;

  const sourceDateTime = _momentTimezone.default.tz(combinedStr, "YYYY-MM-DD HH:mm", timezoneId);

  return sourceDateTime;
};

exports.convertToActualDate = convertToActualDate;

const getOffsetFromAddress = (lat, lng, timestamp, fn) => {
  //let d =  timezone.data(lat, lng, timestamp);
  _nodeGoogleTimezone.default.data(lat, lng, timestamp, function (err, tz) {
    fn(tz.raw_response);
  });
}; // password encryption.


exports.getOffsetFromAddress = getOffsetFromAddress;

const encryptpassword = password => {
  return (0, _md.default)(password);
}; // Generate random strings.


exports.encryptpassword = encryptpassword;

const generateRandom = (length, alphanumeric) => {
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

exports.generateRandom = generateRandom;

const randomToken = value => {
  const valueWithTimeStamp = value + Date.now();
  return (0, _md.default)(valueWithTimeStamp);
}; // Genrate image random name


exports.randomToken = randomToken;

const generateImageRandom = (length = 32) => {
  let data = "",
      keys = "0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz-";

  for (let i = 0; i < length; i++) {
    data += keys.charAt(Math.floor(Math.random() * keys.length));
  }

  return data;
};
/*********** Generate JWT token *************/


exports.generateImageRandom = generateImageRandom;

const generateToken = data => _jsonwebtoken.default.sign(data, jwtKey, {
  algorithm: jwtAlgo,
  expiresIn: "90d"
});
/*********** Decode JWT token *************/


exports.generateToken = generateToken;

const decodeToken = token => _jsonwebtoken.default.verify(token, jwtKey);
/*********** Verify token *************/


exports.decodeToken = decodeToken;

const checkTokenAdmin = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};

  try {
    decoded = _jsonwebtoken.default.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
  }

  const user = await _user.default.checkToken(token);

  if (user && (user.role == 1 || user.role == 4)) {
    req.user = { ...decoded,
      token
    };
    next();
  } else {
    res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
  }
};
/*********** Verify Fan token *************/


exports.checkTokenAdmin = checkTokenAdmin;

const checkTokenFan = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};

  try {
    decoded = _jsonwebtoken.default.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
  }

  const user = await _user.default.checkToken(token);

  if (user && user.role == 2) {
    req.user = { ...decoded,
      token
    };
    next();
  } else {
    res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
  }
};
/*********** Verify token *************/


exports.checkTokenFan = checkTokenFan;

const checkToken = async (req, res, next) => {
  if (req.headers["authorization"]) {
    const token = req.headers["authorization"];
    let decoded = {};

    try {
      decoded = _jsonwebtoken.default.verify(token, jwtKey);
    } catch (err) {
      return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
    }

    const user = await _user.default.checkToken(token);

    if (user && (user.role == 2 || user.role == 3 || user.role == 1 || user.role == 4)) {
      req.user = { ...decoded,
        token
      };
      next();
    } else {
      res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
    }
  } else {
    next();
  }
};
/*********** Verify celebrity token *************/


exports.checkToken = checkToken;

const checkTokenCelebrity = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};

  try {
    decoded = _jsonwebtoken.default.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
  }

  const user = await _user.default.checkToken(token);

  if (user && user.role == 3) {
    req.user = { ...decoded,
      token
    };
    next();
  } else {
    res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
  }
};
/*********** Verify all type user token *************/


exports.checkTokenCelebrity = checkTokenCelebrity;

const checkTokenCommon = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};

  try {
    decoded = _jsonwebtoken.default.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
  }

  const user = await _user.default.checkToken(token);

  if (user) {
    req.user = { ...decoded,
      token
    };
    next();
  } else {
    res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
  }
};
/*********** Verify token for celebrity & admin *************/


exports.checkTokenCommon = checkTokenCommon;

const checkTokenForCelebrityAndAdmin = async (req, res, next) => {
  console.log(req.query);
  const token = req.headers["authorization"];
  let decoded = {};

  try {
    decoded = _jsonwebtoken.default.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
  }

  const user = await _user.default.checkToken(token);

  if (user && user.role == 3 || user && user.role == 1 || user && user.role == 4) {
    req.user = { ...decoded,
      token
    };
    next();
  } else {
    res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
  }
};
/*********** Verify token for celebrity & fan *************/


exports.checkTokenForCelebrityAndAdmin = checkTokenForCelebrityAndAdmin;

const checkTokenForCelebrityAndFan = async (req, res, next) => {
  const token = req.headers["authorization"];
  let decoded = {};

  try {
    decoded = _jsonwebtoken.default.verify(token, jwtKey);
  } catch (err) {
    return res.status(401).json((0, _response.failAction)(_messages.default.tokenExpired, 401));
  }

  const user = await _user.default.checkToken(token);

  if (user && user.role == 3 || user && user.role == 2) {
    req.user = { ...decoded,
      token
    };
    next();
  } else {
    res.status(401).json((0, _response.failAction)(_messages.default.unauthorizedUser, 401));
  }
};
/*********** check memeber subcription token *************/


exports.checkTokenForCelebrityAndFan = checkTokenForCelebrityAndFan;

const checkMemberSubcription = async (req, res, next) => {
  // const userSubscrption = await SUBCRIPTIONMODEL.checksubcription(req.user.userId)
  const user = await _user.default.findone({
    _id: _mongoose.default.Types.ObjectId(req.user.userId)
  });

  if (user && user.isSubscribed) {
    next();
  } else {
    res.status(200).json((0, _response.failAction)(_messages.default.unSubscribedUser, 402));
  }
}; // get distance between two coordinates
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


exports.checkMemberSubcription = checkMemberSubcription;

const getDistance = async (lat1, lng1, lat2, lng2) => {
  const Location1Str = lat1 + "," + lng1;
  const Location2Str = lat2 + "," + lng2;
  const GOOGLE_API_KEY = "AIzaSyDS-4ySJ5GMvHVmQW59zVIUw9jMLjYNUW4";
  let ApiURL = "https://maps.googleapis.com/maps/api/distancematrix/json?";
  let params = `origins=${Location1Str}&destinations=${Location2Str}&key=${GOOGLE_API_KEY}`; // you need to get a key

  let finalApiURL = `${ApiURL}${encodeURI(params)}`; // let fetchResult = await fetch(finalApiURL); // call API
  // let Result = await fetchResult.json(); // extract json

  let fetchResult = await _axios.default.get(finalApiURL);
  console.log("Result", fetchResult.data.rows[0].elements[0].distance.text);
  var distanceInMile = fetchResult.data.rows[0].elements[0].distance.value / 1000 * 0.62137119;
  console.log('distanceInMile', distanceInMile);
  distanceInMile = distanceInMile.toFixed(2);
  console.log('distanceInMile', distanceInMile); // return false;

  return distanceInMile; // return Result.rows[0].elements[0].distance;
};

exports.getDistance = getDistance;

function deg2rad(deg) {
  return deg * (Math.PI / 180);
}

const diff_hours = (dt2, dt1) => {
  var diff = (dt2.getTime() - dt1.getTime()) / 1000;
  diff /= 60 * 60;
  return Math.abs(Math.round(diff));
};

exports.diff_hours = diff_hours;