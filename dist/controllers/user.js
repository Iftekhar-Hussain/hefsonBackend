"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.validateToken = exports.globalSearch = exports.dashboard = exports.addUser = exports.getAllUsers = exports.updateNotificationSetting = exports.getTerms = exports.addDriver = exports.resetPassword = exports.resendPhoneToken = exports.resendEmailToken = exports.phoneVerify = exports.emailVerify = exports.getById = exports.remove = exports.updateStatus = exports.changePassword = exports.checkCurrentPassword = exports.deleteDriver = exports.updateDriver = exports.detailDriver = exports.listDrivers = exports.getProfile = exports.logout = exports.forgotPassword = exports.login = exports.updateProfile = exports.updateUser = exports.socialLogin = exports.registerUser = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/user"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _terms = _interopRequireDefault(require("../collections/terms"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: user.js
 * @description: It Contain function layer for user controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add user service and perform error handling
 */
const registerUser = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.save(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.userAdded));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call social login service and perform error handling
 */


exports.registerUser = registerUser;

const socialLogin = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.socialReg(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update user service and perform error handling
 */


exports.socialLogin = socialLogin;

const updateUser = async (req, res, next) => {
  try {
    let payload = req.body; // return false;

    const data = await SERVICE.update(req.user, payload);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update profile service and perform error handling
 */


exports.updateUser = updateUser;

const updateProfile = async (req, res, next) => {
  try {
    let payload = req.body;
    payload.userId = req.user.userId; //payload.dob = payload.dob + "T00:00:00.000Z";

    const data = await SERVICE.updateProfile(payload);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.failAction)("Unable to update profile, please try after some time"));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call login  service and perform error handling
 */


exports.updateProfile = updateProfile;

const login = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.onLogin(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call forget password service and perform error handling
 */


exports.login = login;

const forgotPassword = async (req, res, next) => {
  const payload = req.body;

  try {
    const data = await SERVICE.paswordForgot(payload);
    res.json((0, _response.successAction)(data, _messages.default.emailSend));
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call logout service and perform error handling
 */


exports.forgotPassword = forgotPassword;

const logout = async (req, res, next) => {
  const payload = req.user;

  try {
    await SERVICE.logoutUser(payload);
    res.status(200).json((0, _response.successAction)(null, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get user profile service and perform error handling
 */


exports.logout = logout;

const getProfile = async (req, res, next) => {
  const payload = req.user;

  try {
    const rest = await SERVICE.getProfile(payload);
    res.status(200).json((0, _response.successAction)(rest, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get Drivers List service and perform error handling
 */


exports.getProfile = getProfile;

const listDrivers = async (req, res, next) => {
  const payload = req.query;

  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listDrivers(req.user, payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get Drivers detail service and perform error handling
 */


exports.listDrivers = listDrivers;

const detailDriver = async (req, res, next) => {
  const payload = req.params;

  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.detailDriver(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update driver service and perform error handling
 */


exports.detailDriver = detailDriver;

const updateDriver = async (req, res, next) => {
  const payload = req.body;
  payload.userId = payload._id && payload._id != "" ? payload._id : req.user.userId;

  try {
    const result = await SERVICE.updateDriver(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.userUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update driver service and perform error handling
 */


exports.updateDriver = updateDriver;

const deleteDriver = async (req, res, next) => {
  const payload = req.body;
  payload.isDeleted = true;

  try {
    const result = await SERVICE.deleteDriver(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.delUser));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call check current password service and perform error handling
 */


exports.deleteDriver = deleteDriver;

const checkCurrentPassword = async (req, res, next) => {
  try {
    const payload = req.body;
    payload["_id"] = req.user.userId;
    const data = await SERVICE.checkCurrentPassword(payload);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.failAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call change password service and perform error handling
 */


exports.checkCurrentPassword = checkCurrentPassword;

const changePassword = async (req, res, next) => {
  let payload = req.body;
  let query = {
    _id: req.user.userId
  };

  try {
    const data = await SERVICE.changePassword(query, payload);
    res.json((0, _response.successAction)(null, _messages.default.passwordUpdated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update status service and perform error handling
 */


exports.changePassword = changePassword;

const updateStatus = async (req, res, next) => {
  try {
    const data = await SERVICE.updateStatus(req.body);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call remove user service and perform error handling
 */


exports.updateStatus = updateStatus;

const remove = async (req, res, next) => {
  try {
    const data = await SERVICE.remove(req.params);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get user details service and perform error handling
 */


exports.remove = remove;

const getById = async (req, res, next) => {
  try {
    const data = await SERVICE.getById(req.params);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call verify email service and perform error handling
 */


exports.getById = getById;

const emailVerify = async (req, res, next) => {
  try {
    const data = await SERVICE.emailVerify(req.body);

    if (data) {
      res.json((0, _response.successAction)(_messages.default.emailVerify));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call verify phone service and perform error handling
 */


exports.emailVerify = emailVerify;

const phoneVerify = async (req, res, next) => {
  try {
    const data = await SERVICE.phoneVerify(req.body);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call resend email token service and perform error handling
 */


exports.phoneVerify = phoneVerify;

const resendEmailToken = async (req, res, next) => {
  try {
    const data = await SERVICE.resendEmailToken(req.body);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.emailResendToken));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call resend phone token service and perform error handling
 */


exports.resendEmailToken = resendEmailToken;

const resendPhoneToken = async (req, res, next) => {
  try {
    const data = await SERVICE.resendPhoneToken(req.body);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.phoneResendToken));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call reset password  service and perform error handling
 */


exports.resendPhoneToken = resendPhoneToken;

const resetPassword = async (req, res, next) => {
  try {
    const data = await SERVICE.resetPassword(req.body);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.passwordUpdated));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add driver service and perform error handling
 */


exports.resetPassword = resetPassword;

const addDriver = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.saveDriver(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.driverAdded));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get user terms service and perform error handling
 */


exports.addDriver = addDriver;

const getTerms = async (req, res, next) => {
  try {
    const data = await _terms.default.find();
    res.status(200).json((0, _response.successAction)(data, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};
/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call notificationsetting service and perform error handling
 */


exports.getTerms = getTerms;

const updateNotificationSetting = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.userId = req.user.userId;
    payload.appUrl = `${req.protocol}://${req.headers.host}`;
    const data = await SERVICE.updateProfile(payload);
    res.status(200).json((0, _response.successAction)(data, _messages.default.updateNotifictionSetting));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.updateNotificationSetting = updateNotificationSetting;

const getAllUsers = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.getAllUsers(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getAllUsers = getAllUsers;

const addUser = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.addUser(payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.addUser = addUser;

const dashboard = async (req, res, next) => {
  //const payload = req.user;
  try {
    const rest = await SERVICE.dashboard(req.user);
    res.status(200).json((0, _response.successAction)(rest, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.dashboard = dashboard;

const globalSearch = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.globalSearch(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.globalSearch = globalSearch;

const validateToken = async (req, res, next) => {
  try {
    const data = await SERVICE.validateToken(req.body);

    if (data) {
      res.json((0, _response.successAction)(data, _messages.default.success));
    } else {
      res.json((0, _response.successAction)([]));
    }
  } catch (error) {
    res.json((0, _response.failAction)(error.message));
  }
};

exports.validateToken = validateToken;