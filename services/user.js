/*
 * @file: USERMODEL.js
 * @description: It Contain function layer for user service.
 * @author: Aditi Goel
 */

import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import USERMODEL from "../collections/user";
import PORTFOLIOMODEL from "../collections/portfolio";
import SENSORMODEL from "../collections/sensor";
import SHIPMENTMODEL from "../collections/shipment";
import TRAILERMODEL from "../collections/trailer";
import TRUCKMODEL from "../collections/truck";
import ALARMMODEL from "../collections/alarm";
import NOTIFICATIONMODEL from "../collections/notification";
import Message from "../utilities/messages";
import Stripe from "stripe";
import PARTICIPANTMODEL from "../collections/participant";
const request = require("request");
import fs from "fs";
import {
  encryptpassword,
  generateToken,
  generateRandom,
  getTimeStamp,
  randomToken,
} from "../utilities/universal";
import { createContact } from "../utilities/mailchimp";
import * as Mail from "../utilities/mail";
import { type } from "os";
import path from "path";
const imagePath = "./public/images/";
const videoPath = "./public/uploads/";
import config from "config";
const { jwtAlgo, jwtKey } = config.get("app");
const {
  frontendUrl,
  twillio,
  SEND_GRID_KEY,
  logoUrl,
  Stripe_Publishable_key,
  Stripe_Secret_key,
} = config.get("app");
const moment = require("moment");
const stripe = new Stripe("sk_test_OHRXUu5cYNmm8GyXYOPhThd5002m3Wsc4Z");
var ObjectId = require("mongodb").ObjectID;
import axios from "axios";

/**
 *
 * @param {*} payload
 * @description - save users to db
 */
/********** Save users **********/
export const save = async (payload) => {
  //check if email exist
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    const userEmailExists = await USERMODEL.checkEmail(payload.email);
    if (userEmailExists) throw new Error(Message.emailAlreadyExists);
  }

  const pwd = payload.password;
  payload["password"] = encryptpassword(payload.password);
  payload.role = payload.role;
  payload.emailVerification = generateRandom(6, false);

  if (payload.role == 2) {
    payload.id = "C" + generateRandom(6, false);
  } else if (payload.role == 3) {
    payload.id == "B" + generateRandom(6, false);
  } else if (payload.role == 5) {
    payload.id == "A" + generateRandom(6, false);
  }

  let saveData = await USERMODEL.saveUser(payload);

  /***************** verificatiopn email ****************/
  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    pwd: pwd,
    emailVerifyToken:
      payload.emailVerification && payload.emailVerification != ""
        ? payload.emailVerification
        : "",
    emailTemplate: "user-account",
    data: saveData,
  });

  if (saveData.email && saveData.email != "") {
    const emailData = {
      to: saveData.email,
      subject: Mail.subjects.registerRequest,
      html: result.html,
      templateId: "user-account",
    };

    Mail.SENDEMAIL(emailData, function (err, res) {
      if (err)
        console.log(
          "-----@@----- Error at sending verify mail to user -----@@-----",
          err
        );
      else
        console.log(
          "-----@@----- Response at sending verify mail to user -----@@-----",
          res
        );
    });
  }
  let loginToken = generateToken({
    when: getTimeStamp(),
    userId: saveData._id,
    role: saveData.role,
  });

  let updateData = {
    $set: {
      loginToken: loginToken,
    },
  };
  let saveData1 = await USERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(saveData._id) },
    updateData
  );
  return true;
};

/**
 *
 * @param {*} payload
 * @description - save drivers to db
 */
/********** Save users **********/
export const saveDriver = async (user, payload) => {
  //check if email exist
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    const userEmailExists = await USERMODEL.checkEmail(payload.email);
    if (userEmailExists) throw new Error(Message.emailAlreadyExists);
  }

  const pwd = generateRandom(8, true);
  payload["password"] = encryptpassword(pwd);
  payload.emailVerification = generateRandom(6, false);
  payload.id = "D" + generateRandom(6, false);
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
    carrierId:
      payload.carrierId && payload.carrierId != ""
        ? payload.carrierId
        : user.userId,
    emailVerification: payload.emailVerification,
    image: payload.image,
  };

  let saveData = await USERMODEL.saveUser(obj);
  let newObj = {
    licenseNo: payload.licenseNo,
    licenseExp: payload.licenseExp,
    issuedState: payload.issuedState,
    driverId: saveData._id,
    ownerId: user.userId,
  };
  let saveDataDriver = await PORTFOLIOMODEL.saveUser(newObj);
  /***************** verificatiopn email ****************/
  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    pwd: pwd,
    emailVerifyToken:
      payload.emailVerification && payload.emailVerification != ""
        ? payload.emailVerification
        : "",
    emailTemplate: "add-driver",
    data: saveData,
  });

  if (saveData.email && saveData.email != "") {
    const emailData = {
      to: saveData.email,
      subject: Mail.subjects.addDriver,
      html: result.html,
      templateId: "add-driver",
    };

    Mail.SENDEMAIL(emailData, function (err, res) {
      if (err)
        console.log(
          "-----@@----- Error at sending verify mail to user -----@@-----",
          err
        );
      else
        console.log(
          "-----@@----- Response at sending verify mail to user -----@@-----",
          res
        );
    });
  }
  let loginToken = generateToken({
    when: getTimeStamp(),
    userId: saveData._id,
    role: saveData.role,
  });

  let updateData = {
    $set: {
      loginToken: loginToken,
    },
  };
  return await USERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(saveData._id) },
    updateData
  );
  // return true;
};

/**
 *
 * @param {*} payload
 * @description - update details of user - driver
 */
export const updateDriver = async (payload) => {
  payload.licenseExp = payload.licenseExp + "T00:00:00.000Z";

  let userD = await USERMODEL.findOne({
    _id: mongoose.Types.ObjectId(payload._id),
  });
  let obj = {
    userId: payload.userId,
    fullName: payload.fullName,
    phone: payload.phone,
    address: payload.address,
    id: userD.id,
    image: payload.image,
  };
  console.log(obj);
  let saveData = await USERMODEL.updateUser(obj);

  let newObj = {
    licenseNo: payload.licenseNo,
    licenseExp: payload.licenseExp,
    issuedState: payload.issuedState,
    id: saveData._id,
  };
  let saveDataDriver = await PORTFOLIOMODEL.updateDri(newObj);

  return saveData;
};

/**
 *
 * @param {*} payload
 * @description - delete user - driver
 */
export const deleteDriver = async (payload) => {
  return await USERMODEL.deleteUser(payload);
};

/**
 *
 * @param {*} payload
 * @description - list of user - driver
 */
export const listDrivers = async (user, payload) => {
  let query = {
    isEmailVerified: { $eq: true },
    isDeleted: { $eq: false },
    role: { $eq: 4 },
  };
  if (user.role == 2) {
    query = {
      ...query,
      carrierId: mongoose.Types.ObjectId(user.userId),
    };
  }
  let sortValue = payload.sortValue;
  let sortBy = payload.sortBy;
  if (payload["search"] && payload["search"] != "") {
    const regex = new RegExp(`${payload["search"]}`, "i");
    query = {
      ...query,
      $or: [
        { fullName: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
      ],
    };
    var data = await USERMODEL.findListDrivers(
      payload,
      query,
      sortBy,
      sortValue
    );
  } else {
    var data = await USERMODEL.findListDrivers(
      payload,
      query,
      sortBy,
      sortValue
    );
  }
  const totalRecords = await data.totalRecords;
  return {
    list: await data.list,
    total: totalRecords.length,
    limit: payload["limit"] ? payload["limit"] : 10,
  };
};

/**
 *
 * @param {*} payload
 * @description - list of user - driver
 */
export const detailDriver = async (payload) => {
  let query = {
    _id: mongoose.Types.ObjectId(payload.id),
    isEmailVerified: true,
    isDeleted: false,
    role: 4,
  };

  var data = await USERMODEL.detailDriver(payload, query);
  let DriverShipments = await SHIPMENTMODEL.aggregate([
    {
      $match: {
        driverId: mongoose.Types.ObjectId(payload.id),
      },
    },
    {
      $group: {
        _id: null,
        totalDistance: { $sum: "$totalDistance" },
        count: { $sum: 1 },
      },
    },
  ]);
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
export const update = async (userData, payload) => {
  //payload.coordinates = [Number(payload.latitude), Number(payload.longitude)];
  return await USERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(payload.id) },
    //  payload,
    {
      $set: {
        businessName: payload.businessName ? payload.businessName : "",
        dotNumber: payload.dotNumber ? payload.dotNumber : "",
        fullName: payload.fullName ? payload.fullName : "",
      },
    },
    { fields: { login_token: 0, password: 0 }, new: true }
  );
};

/**
 *
 * @param {*} payload
 * @description - login user
 */
export const onLogin = async (payload) => {
  let userData;
  if (payload.email && payload.email != "") {
    payload["email"] = payload.email.toLowerCase();
    userData = await USERMODEL.findOneByCondition({
      email: payload.email,
      password: encryptpassword(payload.password),
      isDeleted: false,
    });
  }

  if (!userData) throw new Error(Message.invalidCredentials);
  if (userData.role != 1) {
    if (!userData.isEmailVerified) {
      throw new Error(Message.verifyAccount);
    }
    if (!userData.isActive) {
      throw new Error(Message.accountDeactiavted);
    }
  }

  let tokenObj = {
    when: getTimeStamp(),
    userId: userData._id,
    role: userData.role,
  };

  if (userData.role == 1) {
    let options = await axios({
      method: "post",
      url: "http://icloud.assetscontrols.com:8092/OpenApi/login",
      headers: {
        "Content-Type": "application/json",
      },
      data: {
        FUserName: "hefson",
        FPassword: "7d1b50cbcfef408e999480be49cad0b2",
      },
    });
    payload.sensorToken = options.data.FObject[0].FTokenID;
    tokenObj = { ...tokenObj, sensorToken: payload.sensorToken };
  }

  payload.loginToken = generateToken(tokenObj);
  payload.userId = userData._id;
  payload.password = userData.password;
  const data = await USERMODEL.update(payload);

  let chatcount = await PARTICIPANTMODEL.find({
    receiverId: userData._id,
    isRead: false,
  });

  let matchObj1;
  if (userData.role != 1) {
    matchObj1 = {
      isDeleted: false,
      receiverId: mongoose.Types.ObjectId(userData._id),
      type: { $ne: "alarm" },
    };
  } else {
    matchObj1 = {
      isDeleted: false,
      type: "alarm",
    };
  }
  let query = [
    {
      $match: matchObj1,
    },
  ];

  let count = await NOTIFICATIONMODEL.aggregate(query).allowDiskUse(true);
  let generalNotification = count.length;

  let match = {
    isDeleted: false,
  };

  const startOfDay = new Date(new Date().setUTCHours(0, 0, 0, 0));
  const endOfDay = new Date(new Date().setUTCHours(23, 59, 59, 999));

  match = { ...match, createdAt: { $gte: startOfDay, $lt: endOfDay } };

  let query1 = [
    {
      $match: match,
    },
  ];

  let count1 = await ALARMMODEL.aggregate(query);
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
    generalNotification:generalNotification
  };
};

/**
 *
 * @param {*} payload
 * @description - forget password function
 */
export const paswordForgot = async (payload) => {
  let userData;
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    userData = await USERMODEL.checkEmail(payload.email);
    if (!userData) throw new Error(Message.emailNotExists);
  }

  const resetPasswordToken = generateRandom(8, true);
  let saveData = await USERMODEL.findOneAndUpdate(
    { _id: userData._id },
    { resetPasswordToken: resetPasswordToken }
  );
  /***************** verificatiopn email ****************/
  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    data: userData,
    resetPasswordToken: resetPasswordToken,
    emailTemplate: "forgot-password",
  });

  const emailData = {
    to: payload.email,
    subject: Mail.subjects.forgetPassword,
    html: result.html,
    templateId: "forgot-password",
  };

  Mail.SENDEMAIL(emailData, function (err, res) {
    if (err)
      console.log(
        "-----@@----- Error randomNumberat sending verify mail to user -----@@-----",
        err
      );
    else
      console.log(
        "-----@@----- Response at sending verify mail to user -----@@-----",
        res
      );
  });
  return userData.role;
};

/**
 *
 * @param {*} payload
 * @description - get profile data of user
 */

export const getProfile = async (payload) => {
  let matchObj = { _id: mongoose.Types.ObjectId(payload.userId) };

  let queryObj = await USERMODEL.findOne(matchObj, {
    password: 0,
    login_token: 0,
  });

  return queryObj;
};

/**
 *
 * @param {*} payload
 * @description - update details of user - profile
 */
export const updateProfile = async (payload) => {
  return await USERMODEL.updateUser(payload);
};

/**
 *
 * @param {*} payload
 * @description - logout user
 */
export const logoutUser = async (payload) => {
  return await USERMODEL.logout(payload.userId);
};

/**
 *
 * @param {*} payload
 * @description - change password function get otp
 */

export const changePassword = async (query, payload) => {
  let matchObj = {
    _id: query._id,
    password: encryptpassword(payload.currentpwd),
  };
  const userData = await USERMODEL.findOne(matchObj, { _id: 1 });
  if (!userData) throw new Error(Message.passwordNotMtchedError);
  let updateData = {
    password: encryptpassword(payload.password),
  };
  return await USERMODEL.findOneAndUpdate(query, updateData);
};

/**
 *
 * @param {*} payload
 * @description - social registration
 */
export const socialReg = async (payload) => {
  payload.email = payload.email.toLowerCase();
  var userExists = await USERMODEL.checkEmail(payload.email);
  if (!userExists) {
    payload.isVerified = true;
    payload.isActive = true;
    userExists = await USERMODEL.saveUser({ ...payload });
  }

  if (userExists.role == 2 && !userExists.isBusinessVerified) {
    throw new Error(Message.businessNotVerified);
  }

  let loginToken = generateToken({
    when: getTimeStamp(),
    userId: userExists._id,
    role: userExists.role,
  });
  payload.isFirstLogin = true;
  const data = await USERMODEL.onLoginDone(userExists._id, loginToken, payload);
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
    isFirstLogin: data.isFirstLogin,
  };
};

/**
 *
 * @param {*} payload
 * @description - verify email
 */

export const emailVerify = async (payload) => {
  const uD = await USERMODEL.findOne({ emailVerification: payload.otp });
  if (uD) {
    let updateData = { emailVerification: "", isEmailVerified: true };
    updateData.userId = uD._id;
    const userData = await USERMODEL.update(updateData);
    return userData;
  } else {
    throw new Error(Message.verifyTokenExpired);
  }
};

/**
 *
 * @param {*} payload
 * @description - verify phone
 */

export const phoneVerify = async (payload) => {
  const uD = await USERMODEL.findOne({
    mobileVerifyToken: payload.token,
    phone: payload.phone,
  });
  if (uD) {
    const userData = await USERMODEL.update(
      { userId: uD._id },
      { mobileVerifyToken: "", phoneVerified: true },
      { new: true }
    );
    return userData;
  } else {
    throw new Error(Message.verifyTokenExpired);
  }
};

/**
 *
 * @param {*} payload
 * @description - resend email verification email
 */

export const resendEmailToken = async (payload) => {
  let obj = {};

  if (payload.id && payload.id != "") {
    obj = { ...obj, _id: payload.id };
  }
  if (payload.email && payload.email != "") {
    obj = { ...obj, email: payload.email };
  }
  payload.emailVerifyToken = generateRandom(6, false);
  let uD = await USERMODEL.findOneAndUpdate(
    obj,
    { emailVerification: payload.emailVerifyToken },
    { new: true }
  );

  /***************** verificatiopn email ****************/
  const result = await Mail.htmlFromatWithObject({
    frontendUrl: frontendUrl,
    emailVerifyToken:
      payload.emailVerifyToken && payload.emailVerifyToken != ""
        ? payload.emailVerifyToken
        : "",
    emailTemplate: "user-account",
    data: uD,
  });

  const emailData = {
    to: uD.email,
    subject: Mail.subjects.registerRequest,
    html: result.html,
    templateId: "user-account",
  };

  Mail.SENDEMAIL(emailData, function (err, res) {
    if (err)
      console.log(
        "-----@@----- Error at sending verify mail to user -----@@-----",
        err
      );
    else
      console.log(
        "-----@@----- Response at sending verify mail to user -----@@-----",
        res
      );
  });
  return true;
};

/**
 *
 * @param {*} payload
 * @description - resend phone verification otp
 */

export const resendPhoneToken = async (payload) => {
  payload.mobileVerifyToken = generateRandom(4, false);
  let uD = await USERMODEL.findOneAndUpdate(
    { phone: payload.phone },
    { mobileVerifyToken: payload.mobileVerifyToken },
    { new: true }
  );

  return true;
};

/**
 *
 * @param {*} payload
 * @description - reset password
 */

export const resetPassword = async (payload) => {
  payload["password"] = encryptpassword(payload.password);
  let uD = await USERMODEL.findOne({ resetPasswordToken: payload.token });
  if (!uD) {
    throw new Error(Message.forgotTokenExpired);
  }
  let uD1 = await USERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(uD._id) },
    { resetPasswordToken: "", password: payload["password"] },
    { new: true }
  );

  return uD1.role;
};

export const updateStatus = async (payload) => {
  return await USERMODEL.updateUserStatus(payload);
};

export const getAllUsers = async (user, payload) => {
  let limit = payload.limit ? JSON.parse(payload.limit) : 20;
  payload.page = payload.page ? payload.page : 1;
  let skip = JSON.parse((payload.page - 1) * limit);
  let matchObj = { isDeleted: false };

  if (payload.search) {
    payload.search = payload.search.toLowerCase();
    const regex = new RegExp(`${payload["search"]}`, "i");
    matchObj = {
      ...matchObj,
      $or: [
        { fullName: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    };
  }

  if (user.role == 1) {
    matchObj = {
      ...matchObj,
      role: { $ne: 1 },
    };
  }

  if (user.role != 1) {
    matchObj = {
      ...matchObj,
      _id: { $ne: mongoose.Types.ObjectId(user.userId) },
    };
  }

  if (payload.role) {
    matchObj = {
      ...matchObj,
      role: payload.role,
    };
  }

  let query = [
    {
      $match: matchObj,
    },
    {
      $lookup: {
        from: "protfolios",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$driverId", "$$id"] }],
              },
            },
          },
        ],
        as: "protfolioInfo",
      },
    },
    { $unwind: { path: "$protfolioInfo", preserveNullAndEmptyArrays: true } },
    { $sort: { createdAt: -1 } },
  ];

  let count = await USERMODEL.aggregate(query);
  let total = count.length;
  query.push({ $skip: skip });
  query.push({ $limit: limit });
  let userList = await USERMODEL.aggregate(query);
  return {
    data: userList,
    total: total,
  };
};

export const getById = async (payload) => {
  console.log("payload", payload);
  let matchObj = { _id: mongoose.Types.ObjectId(payload.id) };

  let query = [
    {
      $match: matchObj,
    },
    {
      $lookup: {
        from: "protfolios",
        let: { id: "$_id" },
        pipeline: [
          {
            $match: {
              $expr: {
                $and: [{ $eq: ["$driverId", "$$id"] }],
              },
            },
          },
        ],
        as: "protfolioInfo",
      },
    },
    { $unwind: { path: "$protfolioInfo", preserveNullAndEmptyArrays: true } },
  ];
  let userData = await USERMODEL.aggregate(query);
  return userData;
};

export const addUser = async (payload) => {
  //check if email exist
  if (payload.email && payload.email != "") {
    payload.email = payload.email.toLowerCase();
    const userEmailExists = await USERMODEL.checkEmail(payload.email);
    if (userEmailExists) throw new Error(Message.emailAlreadyExists);
  }

  const pwd = generateRandom(8, true);
  payload["password"] = encryptpassword(pwd);
  payload.role = payload.role;
  payload.emailVerification = "";
  payload.isEmailVerified = true;
  // payload.licenseExp = payload.licenseExp + "T00:00:00.000Z";
  if (payload.role == 2) {
    payload.id = "C" + generateRandom(6, false);
  } else if (payload.role == 3) {
    payload.id == "B" + generateRandom(6, false);
  } else if (payload.role == 5) {
    payload.id == "A" + generateRandom(6, false);
  }
  // else if (payload.role == 4) {
  //   payload.id == "D" + generateRandom(6, false);
  // }

  let saveData = await USERMODEL.saveUser(payload);
  // if (payload.role == 4) {
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
    data: saveData,
  });

  if (saveData.email && saveData.email != "") {
    const emailData = {
      to: saveData.email,
      subject: Mail.subjects.registerRequest,
      html: result.html,
      templateId: "user-account-admin",
    };

    Mail.SENDEMAIL(emailData, function (err, res) {
      if (err)
        console.log(
          "-----@@----- Error at sending verify mail to user -----@@-----",
          err
        );
      else
        console.log(
          "-----@@----- Response at sending verify mail to user -----@@-----",
          res
        );
    });
  }
  let loginToken = generateToken({
    when: getTimeStamp(),
    userId: saveData._id,
    role: saveData.role,
  });

  let updateData = {
    $set: {
      loginToken: loginToken,
    },
  };
  let saveData1 = await USERMODEL.findOneAndUpdate(
    { _id: mongoose.Types.ObjectId(saveData._id) },
    updateData
  );
  return saveData1;
};

export const dashboard = async (user) => {
  let totalSensor,
    activeSensor,
    inActiveSensor,
    alarm = 0;
  totalSensor = await SENSORMODEL.count({ isDeleted: false });

  activeSensor = await SHIPMENTMODEL.count({
    isDeleted: false,
    isStart: true,
    isCancelled: false,
    isCompleted: false,
  });

  inActiveSensor = totalSensor - activeSensor;

  alarm = await ALARMMODEL.count({ isDeleted: false });
  return {
    data: { totalSensor, activeSensor, inActiveSensor, alarm },
  };
};

export const globalSearch = async (user, payload) => {
  payload.search = payload.search.toLowerCase();
  const regex = new RegExp(`${payload["search"]}`, "i");

  let users = await USERMODEL.find(
    {
      role: 4,
      carrierId: mongoose.Types.ObjectId(user.userId),
      isDeleted: false,
      $or: [
        { fullName: { $regex: regex } },
        { firstName: { $regex: regex } },
        { lastName: { $regex: regex } },
        { email: { $regex: regex } },
      ],
    },
    { _id: 1, firstName: 1, lastName: 1, fullName: 1, email: 1 }
  );

  let shipments = await SHIPMENTMODEL.find(
    {
      carrierId: mongoose.Types.ObjectId(user.userId),
      isDeleted: false,
      $or: [{ loadId: { $regex: regex } }],
    },
    {
      _id: 1,
      loadId: 1,
    }
  );

  let trucks = await TRUCKMODEL.find(
    {
      carrierId: mongoose.Types.ObjectId(user.userId),
      isDeleted: false,
      $or: [
        { unitNumber: { $regex: regex } },
        { numberPlate: { $regex: regex } },
      ],
    },
    {
      _id: 1,
      unitNumber: 1,
      numberPlate: 1,
    }
  );

  let trailers = await TRAILERMODEL.find(
    {
      carrierId: mongoose.Types.ObjectId(user.userId),
      isDeleted: false,
      $or: [
        { unitNumber: { $regex: regex } },
        { numberPlate: { $regex: regex } },
      ],
    },
    {
      _id: 1,
      unitNumber: 1,
      numberPlate: 1,
    }
  );

  let sensors = await SENSORMODEL.find(
    {
      userId: mongoose.Types.ObjectId(user.userId),
      isDeleted: false,
      $or: [
        { FGUID: { $regex: regex } },
        { FVehicleName: { $regex: regex } },
        { FAssetID: { $regex: regex } },
      ],
    },
    {
      _id: 1,
      FGUID: 1,
      FVehicleName: 1,
      FAssetID: 1,
    }
  );

  return {
    users,
    shipments,
    trucks,
    trailers,
    sensors,
  };
};

export const validateToken = async (payload) => {
  let decoded = jwt.verify(payload.token, jwtKey);
  console.log(decoded);
  if (decoded.userId) {
    const user = await USERMODEL.checkToken(payload.token);
    if (user) {
      return {
        tokenVerify: true,
      };
    } else {
      return {
        tokenVerify: false,
      };
    }
  } else {
    throw new Error(Message.verifyTokenExpired);
  }
};
