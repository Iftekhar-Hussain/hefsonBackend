"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = exports.globalSearch = exports.dashboard = exports.addUser = exports.getById = exports.getAllUsers = exports.updateStatus = exports.resetPassword = exports.resendPhoneToken = exports.resendEmailToken = exports.phoneVerify = exports.emailVerify = exports.socialReg = exports.changePassword = exports.logoutUser = exports.updateProfile = exports.getProfile = exports.paswordForgot = exports.onLogin = exports.update = exports.detailDriver = exports.listDrivers = exports.deleteDriver = exports.updateDriver = exports.saveDriver = exports.save = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _jsonwebtoken = _interopRequireDefault(require("jsonwebtoken"));

var _user = _interopRequireDefault(require("../collections/user"));

var _portfolio = _interopRequireDefault(require("../collections/portfolio"));

var _sensor = _interopRequireDefault(require("../collections/sensor"));

var _shipment = _interopRequireDefault(require("../collections/shipment"));

var _trailer = _interopRequireDefault(require("../collections/trailer"));

var _truck = _interopRequireDefault(require("../collections/truck"));

var _alarm = _interopRequireDefault(require("../collections/alarm"));

var _notification = _interopRequireDefault(require("../collections/notification"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _stripe = _interopRequireDefault(require("stripe"));

var _participant = _interopRequireDefault(require("../collections/participant"));

var _fs = _interopRequireDefault(require("fs"));

var _universal = require("../utilities/universal");

var _mailchimp = require("../utilities/mailchimp");

var Mail = _interopRequireWildcard(require("../utilities/mail"));

var _os = require("os");

var _path = _interopRequireDefault(require("path"));

var _config = _interopRequireDefault(require("config"));

var _axios = _interopRequireDefault(require("axios"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: USERMODEL.js
 * @description: It Contain function layer for user service.
 * @author: Aditi Goel
 */
const request = require("request");

const imagePath = "./public/images/";
const videoPath = "./public/uploads/";

const {
  jwtAlgo,
  jwtKey
} = _config.default.get("app");

const {
  frontendUrl,
  twillio,
  SEND_GRID_KEY,
  logoUrl,
  Stripe_Publishable_key,
  Stripe_Secret_key
} = _config.default.get("app");

const moment = require("moment");

const stripe = new _stripe.default("sk_test_OHRXUu5cYNmm8GyXYOPhThd5002m3Wsc4Z");

var ObjectId = require("mongodb").ObjectID;

/**
 *
 * @param {*} payload
 * @description - save users to db
 */

/********** Save users **********/
const save = async payload => {
  //check if email exist
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    const userEmailExists = await _user.default.checkEmail(payload.email);
    if (userEmailExists) throw new Error(_messages.default.emailAlreadyExists);
  }

  const pwd = payload.password;
  payload["password"] = (0, _universal.encryptpassword)(payload.password);
  payload.role = payload.role;
  payload.emailVerification = (0, _universal.generateRandom)(6, false);

  if (payload.role == 2) {
    payload.id = "C" + (0, _universal.generateRandom)(6, false);
  } else if (payload.role == 3) {
    payload.id == "B" + (0, _universal.generateRandom)(6, false);
  } else if (payload.role == 5) {
    payload.id == "A" + (0, _universal.generateRandom)(6, false);
  }

  let saveData = await _user.default.saveUser(payload);
  /***************** verificatiopn email ****************/

  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    pwd: pwd,
    emailVerifyToken: payload.emailVerification && payload.emailVerification != "" ? payload.emailVerification : "",
    emailTemplate: "user-account",
    data: saveData
  });

  if (saveData.email && saveData.email != "") {
    const emailData = {
      to: saveData.email,
      subject: Mail.subjects.registerRequest,
      html: result.html,
      templateId: "user-account"
    };
    Mail.SENDEMAIL(emailData, function (err, res) {
      if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
    });
  }

  let loginToken = (0, _universal.generateToken)({
    when: (0, _universal.getTimeStamp)(),
    userId: saveData._id,
    role: saveData.role
  });
  let updateData = {
    $set: {
      loginToken: loginToken
    }
  };
  let saveData1 = await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(saveData._id)
  }, updateData);
  return true;
};
/**
 *
 * @param {*} payload
 * @description - save drivers to db
 */

/********** Save users **********/


exports.save = save;

const saveDriver = async (user, payload) => {
  //check if email exist
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    const userEmailExists = await _user.default.checkEmail(payload.email);
    if (userEmailExists) throw new Error(_messages.default.emailAlreadyExists);
  }

  const pwd = (0, _universal.generateRandom)(8, true);
  payload["password"] = (0, _universal.encryptpassword)(pwd);
  payload.emailVerification = (0, _universal.generateRandom)(6, false);
  payload.id = "D" + (0, _universal.generateRandom)(6, false);
  payload.licenseExp = payload.licenseExp + "T00:00:00.000Z";
  let obj = {
    fullName: payload.fullName,
    phone: payload.phone,
    address: payload.address,
    id: payload.id,
    email: payload.email,
    password: payload.password,
    role: 4,
    isEmailVerified: true,
    isActive: false,
    carrierId: payload.carrierId && payload.carrierId != "" ? payload.carrierId : user.userId,
    emailVerification: payload.emailVerification,
    image: payload.image
  };
  let saveData = await _user.default.saveUser(obj);
  let newObj = {
    licenseNo: payload.licenseNo,
    licenseExp: payload.licenseExp,
    issuedState: payload.issuedState,
    driverId: saveData._id,
    ownerId: user.userId
  };
  let saveDataDriver = await _portfolio.default.saveUser(newObj);
  /***************** verificatiopn email ****************/

  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    pwd: pwd,
    emailVerifyToken: payload.emailVerification && payload.emailVerification != "" ? payload.emailVerification : "",
    emailTemplate: "add-driver",
    data: saveData
  });

  if (saveData.email && saveData.email != "") {
    const emailData = {
      to: saveData.email,
      subject: Mail.subjects.addDriver,
      html: result.html,
      templateId: "add-driver"
    };
    Mail.SENDEMAIL(emailData, function (err, res) {
      if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
    });
  }

  let loginToken = (0, _universal.generateToken)({
    when: (0, _universal.getTimeStamp)(),
    userId: saveData._id,
    role: saveData.role
  });
  let updateData = {
    $set: {
      loginToken: loginToken
    }
  };
  return await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(saveData._id)
  }, updateData); // return true;
};
/**
 *
 * @param {*} payload
 * @description - update details of user - driver
 */


exports.saveDriver = saveDriver;

const updateDriver = async payload => {
  payload.licenseExp = payload.licenseExp + "T00:00:00.000Z";
  let userD = await _user.default.findOne({
    _id: _mongoose.default.Types.ObjectId(payload._id)
  });
  let obj = {
    userId: payload.userId,
    fullName: payload.fullName,
    phone: payload.phone,
    address: payload.address,
    id: userD.id,
    image: payload.image
  };
  console.log(obj);
  let saveData = await _user.default.updateUser(obj);
  let newObj = {
    licenseNo: payload.licenseNo,
    licenseExp: payload.licenseExp,
    issuedState: payload.issuedState,
    id: saveData._id
  };
  let saveDataDriver = await _portfolio.default.updateDri(newObj);
  return saveData;
};
/**
 *
 * @param {*} payload
 * @description - delete user - driver
 */


exports.updateDriver = updateDriver;

const deleteDriver = async payload => {
  return await _user.default.deleteUser(payload);
};
/**
 *
 * @param {*} payload
 * @description - list of user - driver
 */


exports.deleteDriver = deleteDriver;

const listDrivers = async (user, payload) => {
  let query = {
    isEmailVerified: {
      $eq: true
    },
    isDeleted: {
      $eq: false
    },
    role: {
      $eq: 4
    }
  };

  if (user.role == 2) {
    query = { ...query,
      carrierId: _mongoose.default.Types.ObjectId(user.userId)
    };
  }

  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;

  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = { ...query,
      $or: [{
        fullName: {
          $regex: regex
        }
      }, {
        firstName: {
          $regex: regex
        }
      }, {
        lastName: {
          $regex: regex
        }
      }]
    };
    var data = await _user.default.findListDrivers(payload, query, sortBy, sortValue);
  } else {
    var data = await _user.default.findListDrivers(payload, query, sortBy, sortValue);
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
 * @description - list of user - driver
 */


exports.listDrivers = listDrivers;

const detailDriver = async payload => {
  let query = {
    _id: _mongoose.default.Types.ObjectId(payload.id),
    isEmailVerified: true,
    isDeleted: false,
    role: 4
  };
  var data = await _user.default.detailDriver(payload, query);
  let DriverShipments = await _shipment.default.aggregate([{
    $match: {
      driverId: _mongoose.default.Types.ObjectId(payload.id)
    }
  }, {
    $group: {
      _id: null,
      totalDistance: {
        $sum: "$totalDistance"
      },
      count: {
        $sum: 1
      }
    }
  }]);

  if (DriverShipments.length) {
    data[0].totalDistance = DriverShipments[0].totalDistance;
    data[0].shipments = DriverShipments[0].count;
  } else {
    data[0].totalDistance = 0;
    data[0].shipments = 0;
  }

  return data;
};
/**
 *
 * @param {*} payload
 * @description - update details of user
 */


exports.detailDriver = detailDriver;

const update = async (userData, payload) => {
  //payload.coordinates = [Number(payload.latitude), Number(payload.longitude)];
  return await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(payload.id)
  }, //  payload,
  {
    $set: {
      businessName: payload.businessName ? payload.businessName : "",
      dotNumber: payload.dotNumber ? payload.dotNumber : "",
      fullName: payload.fullName ? payload.fullName : ""
    }
  }, {
    fields: {
      login_token: 0,
      password: 0
    },
    new: true
  });
};
/**
 *
 * @param {*} payload
 * @description - login user
 */


exports.update = update;

const onLogin = async payload => {
  let userData;

  if (payload.email && payload.email != "") {
    payload["email"] = payload.email.toLowerCase();
    userData = await _user.default.findOneByCondition({
      email: payload.email,
      password: (0, _universal.encryptpassword)(payload.password),
      isDeleted: false
    });
  }

  if (!userData) throw new Error(_messages.default.invalidCredentials);

  if (userData.role != 1) {
    if (!userData.isEmailVerified) {
      throw new Error(_messages.default.verifyAccount);
    }

    if (!userData.isActive) {
      throw new Error(_messages.default.accountDeactiavted);
    }
  }

  let tokenObj = {
    when: (0, _universal.getTimeStamp)(),
    userId: userData._id,
    role: userData.role
  };

  if (userData.role == 1) {
    let options = await (0, _axios.default)({
      method: "post",
      url: "http://icloud.assetscontrols.com:8092/OpenApi/login",
      headers: {
        "Content-Type": "application/json"
      },
      data: {
        FUserName: "hefson",
        FPassword: "7d1b50cbcfef408e999480be49cad0b2"
      }
    });
    payload.sensorToken = options.data.FObject[0].FTokenID;
    tokenObj = { ...tokenObj,
      sensorToken: payload.sensorToken
    };
  }

  payload.loginToken = (0, _universal.generateToken)(tokenObj);
  payload.userId = userData._id;
  payload.password = userData.password;
  const data = await _user.default.update(payload);
  let chatcount = await _participant.default.find({
    receiverId: userData._id,
    isRead: false
  });
  let matchObj1;

  if (userData.role != 1) {
    matchObj1 = {
      isDeleted: false,
      receiverId: _mongoose.default.Types.ObjectId(userData._id),
      type: {
        $ne: "alarm"
      }
    };
  } else {
    matchObj1 = {
      isDeleted: false,
      type: "alarm"
    };
  }

  let query = [{
    $match: matchObj1
  }];
  let count = await _notification.default.aggregate(query).allowDiskUse(true);
  let generalNotification = count.length;
  let match = {
    isDeleted: false
  };
  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999));
  match = { ...match,
    createdAt: {
      $gte: startOfDay,
      $lt: endOfDay
    }
  };
  let query1 = [{
    $match: match
  }];
  let count1 = await _alarm.default.aggregate(query);
  let shipmentNotifications = count1.length;
  return {
    _id: data._id,
    email: data.email,
    loginToken: data.loginToken,
    fullName: data.fullName,
    role: data.role,
    businessName: data.businessName,
    phone: data.phone,
    dotNumber: data.dotNumber,
    image: data.image,
    allowNotification: data.allowNotification,
    alertNotification: data.alertNotification,
    chatNotification: data.chatNotification,
    temperatureAlert: data.temperatureAlert,
    chatCount: chatcount.length,
    shipmentNotifications: shipmentNotifications,
    generalNotification: generalNotification
  };
};
/**
 *
 * @param {*} payload
 * @description - forget password function
 */


exports.onLogin = onLogin;

const paswordForgot = async payload => {
  let userData;

  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    userData = await _user.default.checkEmail(payload.email);
    if (!userData) throw new Error(_messages.default.emailNotExists);
  }

  const resetPasswordToken = (0, _universal.generateRandom)(8, true);
  let saveData = await _user.default.findOneAndUpdate({
    _id: userData._id
  }, {
    resetPasswordToken: resetPasswordToken
  });
  /***************** verificatiopn email ****************/

  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    data: userData,
    resetPasswordToken: resetPasswordToken,
    emailTemplate: "forgot-password"
  });
  const emailData = {
    to: payload.email,
    subject: Mail.subjects.forgetPassword,
    html: result.html,
    templateId: "forgot-password"
  };
  Mail.SENDEMAIL(emailData, function (err, res) {
    if (err) console.log("-----@@----- Error randomNumberat sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
  });
  return userData.role;
};
/**
 *
 * @param {*} payload
 * @description - get profile data of user
 */


exports.paswordForgot = paswordForgot;

const getProfile = async payload => {
  let matchObj = {
    _id: _mongoose.default.Types.ObjectId(payload.userId)
  };
  let queryObj = await _user.default.findOne(matchObj, {
    password: 0,
    login_token: 0
  });
  return queryObj;
};
/**
 *
 * @param {*} payload
 * @description - update details of user - profile
 */


exports.getProfile = getProfile;

const updateProfile = async payload => {
  return await _user.default.updateUser(payload);
};
/**
 *
 * @param {*} payload
 * @description - logout user
 */


exports.updateProfile = updateProfile;

const logoutUser = async payload => {
  return await _user.default.logout(payload.userId);
};
/**
 *
 * @param {*} payload
 * @description - change password function get otp
 */


exports.logoutUser = logoutUser;

const changePassword = async (query, payload) => {
  let matchObj = {
    _id: query._id,
    password: (0, _universal.encryptpassword)(payload.currentpwd)
  };
  const userData = await _user.default.findOne(matchObj, {
    _id: 1
  });
  if (!userData) throw new Error(_messages.default.passwordNotMtchedError);
  let updateData = {
    password: (0, _universal.encryptpassword)(payload.password)
  };
  return await _user.default.findOneAndUpdate(query, updateData);
};
/**
 *
 * @param {*} payload
 * @description - social registration
 */


exports.changePassword = changePassword;

const socialReg = async payload => {
  payload.email = payload.email.toLowerCase();
  var userExists = await _user.default.checkEmail(payload.email);

  if (!userExists) {
    payload.isVerified = true;
    payload.isActive = true;
    userExists = await _user.default.saveUser({ ...payload
    });
  }

  if (userExists.role == 2 && !userExists.isBusinessVerified) {
    throw new Error(_messages.default.businessNotVerified);
  }

  let loginToken = (0, _universal.generateToken)({
    when: (0, _universal.getTimeStamp)(),
    userId: userExists._id,
    role: userExists.role
  });
  payload.isFirstLogin = true;
  const data = await _user.default.onLoginDone(userExists._id, loginToken, payload);
  return {
    _id: data._id,
    email: data.email,
    loginToken: data.login_token[data.login_token.length - 1].token,
    firstname: data.firstname,
    lastname: data.lastname,
    std_code: data.std_code,
    phone: data.phone,
    role: data.role,
    location: data.location,
    latitude: data.latitude,
    longitude: data.longitude,
    coordinates: data.coordinates,
    profilePic: data.profilePic,
    emergencyPhone: data.emergencyPhone,
    //dob: data.dob,
    isFirstLogin: data.isFirstLogin
  };
};
/**
 *
 * @param {*} payload
 * @description - verify email
 */


exports.socialReg = socialReg;

const emailVerify = async payload => {
  const uD = await _user.default.findOne({
    emailVerification: payload.otp
  });

  if (uD) {
    let updateData = {
      emailVerification: "",
      isEmailVerified: true
    };
    updateData.userId = uD._id;
    const userData = await _user.default.update(updateData);
    return userData;
  } else {
    throw new Error(_messages.default.verifyTokenExpired);
  }
};
/**
 *
 * @param {*} payload
 * @description - verify phone
 */


exports.emailVerify = emailVerify;

const phoneVerify = async payload => {
  const uD = await _user.default.findOne({
    mobileVerifyToken: payload.token,
    phone: payload.phone
  });

  if (uD) {
    const userData = await _user.default.update({
      userId: uD._id
    }, {
      mobileVerifyToken: "",
      phoneVerified: true
    }, {
      new: true
    });
    return userData;
  } else {
    throw new Error(_messages.default.verifyTokenExpired);
  }
};
/**
 *
 * @param {*} payload
 * @description - resend email verification email
 */


exports.phoneVerify = phoneVerify;

const resendEmailToken = async payload => {
  let obj = {};

  if (payload.id && payload.id != "") {
    obj = { ...obj,
      _id: payload.id
    };
  }

  if (payload.email && payload.email != "") {
    obj = { ...obj,
      email: payload.email
    };
  }

  payload.emailVerifyToken = (0, _universal.generateRandom)(6, false);
  let uD = await _user.default.findOneAndUpdate(obj, {
    emailVerification: payload.emailVerifyToken
  }, {
    new: true
  });
  /***************** verificatiopn email ****************/

  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    emailVerifyToken: payload.emailVerifyToken && payload.emailVerifyToken != "" ? payload.emailVerifyToken : "",
    emailTemplate: "user-account",
    data: uD
  });
  const emailData = {
    to: uD.email,
    subject: Mail.subjects.registerRequest,
    html: result.html,
    templateId: "user-account"
  };
  Mail.SENDEMAIL(emailData, function (err, res) {
    if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
  });
  return true;
};
/**
 *
 * @param {*} payload
 * @description - resend phone verification otp
 */


exports.resendEmailToken = resendEmailToken;

const resendPhoneToken = async payload => {
  payload.mobileVerifyToken = (0, _universal.generateRandom)(4, false);
  let uD = await _user.default.findOneAndUpdate({
    phone: payload.phone
  }, {
    mobileVerifyToken: payload.mobileVerifyToken
  }, {
    new: true
  });
  return true;
};
/**
 *
 * @param {*} payload
 * @description - reset password
 */


exports.resendPhoneToken = resendPhoneToken;

const resetPassword = async payload => {
  payload["password"] = (0, _universal.encryptpassword)(payload.password);
  let uD = await _user.default.findOne({
    resetPasswordToken: payload.token
  });

  if (!uD) {
    throw new Error(_messages.default.forgotTokenExpired);
  }

  let uD1 = await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(uD._id)
  }, {
    resetPasswordToken: "",
    password: payload["password"]
  }, {
    new: true
  });
  return uD1.role;
};

exports.resetPassword = resetPassword;

const updateStatus = async payload => {
  return await _user.default.updateUserStatus(payload);
};

exports.updateStatus = updateStatus;

const getAllUsers = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = {
    isDeleted: false
  };

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = { ...matchObj,
      $or: [{
        fullName: {
          $regex: regex
        }
      }, {
        firstName: {
          $regex: regex
        }
      }, {
        lastName: {
          $regex: regex
        }
      }, {
        email: {
          $regex: regex
        }
      }]
    };
  }

  if (user.role == 1) {
    matchObj = { ...matchObj,
      role: {
        $ne: 1
      }
    };
  }

  if (user.role != 1) {
    matchObj = { ...matchObj,
      _id: {
        $ne: _mongoose.default.Types.ObjectId(user.userId)
      }
    };
  }

  if (payload.role) {
    matchObj = { ...matchObj,
      role: payload.role
    };
  }

  let query = [{
    $match: matchObj
  }, {
    $lookup: {
      from: "protfolios",
      let: {
        id: "$_id"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$driverId", "$$id"]
            }]
          }
        }
      }],
      as: "protfolioInfo"
    }
  }, {
    $unwind: {
      path: "$protfolioInfo",
      preserveNullAndEmptyArrays: true
    }
  }, {
    $sort: {
      createdAt: -1
    }
  }];
  let count = await _user.default.aggregate(query);
  let total = count.length;
  query.push({
    $skip: skip
  });
  query.push({
    $limit: limit
  });
  let userList = await _user.default.aggregate(query);
  return {
    data: userList,
    total: total
  };
};

exports.getAllUsers = getAllUsers;

const getById = async payload => {
  console.log("payload", payload);
  let matchObj = {
    _id: _mongoose.default.Types.ObjectId(payload.id)
  };
  let query = [{
    $match: matchObj
  }, {
    $lookup: {
      from: "protfolios",
      let: {
        id: "$_id"
      },
      pipeline: [{
        $match: {
          $expr: {
            $and: [{
              $eq: ["$driverId", "$$id"]
            }]
          }
        }
      }],
      as: "protfolioInfo"
    }
  }, {
    $unwind: {
      path: "$protfolioInfo",
      preserveNullAndEmptyArrays: true
    }
  }];
  let userData = await _user.default.aggregate(query);
  return userData;
};

exports.getById = getById;

const addUser = async payload => {
  //check if email exist
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    const userEmailExists = await _user.default.checkEmail(payload.email);
    if (userEmailExists) throw new Error(_messages.default.emailAlreadyExists);
  }

  const pwd = (0, _universal.generateRandom)(8, true);
  payload["password"] = (0, _universal.encryptpassword)(pwd);
  payload.role = payload.role;
  payload.emailVerification = "";
  payload.isEmailVerified = true; // payload.licenseExp = payload.licenseExp + "T00:00:00.000Z";

  if (payload.role == 2) {
    payload.id = "C" + (0, _universal.generateRandom)(6, false);
  } else if (payload.role == 3) {
    payload.id == "B" + (0, _universal.generateRandom)(6, false);
  } else if (payload.role == 5) {
    payload.id == "A" + (0, _universal.generateRandom)(6, false);
  } // else if (payload.role == 4) {
  //   payload.id == "D" + generateRandom(6, false);
  // }


  let saveData = await _user.default.saveUser(payload); // if (payload.role == 4) {
  //   let newObj = {
  //     licenseNo: payload.licenseNo,
  //     licenseExp: payload.licenseExp,
  //     issuedState: payload.issuedState,
  //     driverId: saveData._id,
  //     ownerId: user.userId,
  //   };
  //   let saveDataDriver = await PORTFOLIOMODEL.saveUser(newObj);
  // }

  /***************** verificatiopn email ****************/

  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    pwd: pwd,
    emailTemplate: "user-account-admin",
    data: saveData
  });

  if (saveData.email && saveData.email != "") {
    const emailData = {
      to: saveData.email,
      subject: Mail.subjects.registerRequest,
      html: result.html,
      templateId: "user-account-admin"
    };
    Mail.SENDEMAIL(emailData, function (err, res) {
      if (err) console.log("-----@@----- Error at sending verify mail to user -----@@-----", err);else console.log("-----@@----- Response at sending verify mail to user -----@@-----", res);
    });
  }

  let loginToken = (0, _universal.generateToken)({
    when: (0, _universal.getTimeStamp)(),
    userId: saveData._id,
    role: saveData.role
  });
  let updateData = {
    $set: {
      loginToken: loginToken
    }
  };
  let saveData1 = await _user.default.findOneAndUpdate({
    _id: _mongoose.default.Types.ObjectId(saveData._id)
  }, updateData);
  return saveData1;
};

exports.addUser = addUser;

const dashboard = async user => {
  let totalSensor,
      activeSensor,
      inActiveSensor,
      alarm = 0;
  totalSensor = await _sensor.default.count({
    isDeleted: false
  });
  activeSensor = await _shipment.default.count({
    isDeleted: false,
    isStart: true,
    isCancelled: false,
    isCompleted: false
  });
  inActiveSensor = totalSensor - activeSensor;
  alarm = await _alarm.default.count({
    isDeleted: false
  });
  return {
    data: {
      totalSensor,
      activeSensor,
      inActiveSensor,
      alarm
    }
  };
};

exports.dashboard = dashboard;

const globalSearch = async (user, payload) => {
  payload.search = payload.search.toLowerCase();
  const regex = new RegExp(`${payload["search"]}`, "i");
  let users = await _user.default.find({
    role: 4,
    carrierId: _mongoose.default.Types.ObjectId(user.userId),
    isDeleted: false,
    $or: [{
      fullName: {
        $regex: regex
      }
    }, {
      firstName: {
        $regex: regex
      }
    }, {
      lastName: {
        $regex: regex
      }
    }, {
      email: {
        $regex: regex
      }
    }]
  }, {
    _id: 1,
    firstName: 1,
    lastName: 1,
    fullName: 1,
    email: 1
  });
  let shipments = await _shipment.default.find({
    carrierId: _mongoose.default.Types.ObjectId(user.userId),
    isDeleted: false,
    $or: [{
      loadId: {
        $regex: regex
      }
    }]
  }, {
    _id: 1,
    loadId: 1
  });
  let trucks = await _truck.default.find({
    carrierId: _mongoose.default.Types.ObjectId(user.userId),
    isDeleted: false,
    $or: [{
      unitNumber: {
        $regex: regex
      }
    }, {
      numberPlate: {
        $regex: regex
      }
    }]
  }, {
    _id: 1,
    unitNumber: 1,
    numberPlate: 1
  });
  let trailers = await _trailer.default.find({
    carrierId: _mongoose.default.Types.ObjectId(user.userId),
    isDeleted: false,
    $or: [{
      unitNumber: {
        $regex: regex
      }
    }, {
      numberPlate: {
        $regex: regex
      }
    }]
  }, {
    _id: 1,
    unitNumber: 1,
    numberPlate: 1
  });
  let sensors = await _sensor.default.find({
    userId: _mongoose.default.Types.ObjectId(user.userId),
    isDeleted: false,
    $or: [{
      FGUID: {
        $regex: regex
      }
    }, {
      FVehicleName: {
        $regex: regex
      }
    }, {
      FAssetID: {
        $regex: regex
      }
    }]
  }, {
    _id: 1,
    FGUID: 1,
    FVehicleName: 1,
    FAssetID: 1
  });
  return {
    users,
    shipments,
    trucks,
    trailers,
    sensors
  };
};

exports.globalSearch = globalSearch;

const validateToken = async payload => {
  let decoded = _jsonwebtoken.default.verify(payload.token, jwtKey);

  console.log(decoded);

  if (decoded.userId) {
    const user = await _user.default.checkToken(payload.token);

    if (user) {
      return {
        tokenVerify: true
      };
    } else {
      return {
        tokenVerify: false
      };
    }
  } else {
    throw new Error(_messages.default.verifyTokenExpired);
  }
};

exports.validateToken = validateToken;