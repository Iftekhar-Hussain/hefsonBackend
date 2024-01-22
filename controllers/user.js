/*
 * @file: user.js
 * @description: It Contain function layer for user controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/user";
import Message from "../utilities/messages";
import Terms from "../collections/terms";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add user service and perform error handling
 */
export const registerUser = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.save(payload);
    res.status(200).json(successAction(result, Message.userAdded));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call social login service and perform error handling
 */
export const socialLogin = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.socialReg(payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update user service and perform error handling
 */

export const updateUser = async (req, res, next) => {
  try {
    let payload = req.body;
    // return false;
    const data = await SERVICE.update(req.user, payload);

    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update profile service and perform error handling
 */

export const updateProfile = async (req, res, next) => {
  try {
    let payload = req.body;
    payload.userId = req.user.userId;
    //payload.dob = payload.dob + "T00:00:00.000Z";
    const data = await SERVICE.updateProfile(payload);

    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(
        failAction("Unable to update profile, please try after some time")
      );
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call login  service and perform error handling
 */
export const login = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.onLogin(payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call forget password service and perform error handling
 */
export const forgotPassword = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.paswordForgot(payload);
    res.json(successAction(data, Message.emailSend));
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call logout service and perform error handling
 */
export const logout = async (req, res, next) => {
  const payload = req.user;
  try {
    await SERVICE.logoutUser(payload);
    res.status(200).json(successAction(null, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get user profile service and perform error handling
 */
export const getProfile = async (req, res, next) => {
  const payload = req.user;
  try {
    const rest = await SERVICE.getProfile(payload);
    res.status(200).json(successAction(rest, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get Drivers List service and perform error handling
 */
export const listDrivers = async (req, res, next) => {
  const payload = req.query;
  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listDrivers(req.user, payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get Drivers detail service and perform error handling
 */
export const detailDriver = async (req, res, next) => {
  const payload = req.params;
  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.detailDriver(payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update driver service and perform error handling
 */
export const updateDriver = async (req, res, next) => {
  const payload = req.body;
  payload.userId =
    payload._id && payload._id != "" ? payload._id : req.user.userId;
  try {
    const result = await SERVICE.updateDriver(payload);
    res.status(200).json(successAction(result, Message.userUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update driver service and perform error handling
 */
export const deleteDriver = async (req, res, next) => {
  const payload = req.body;
  payload.isDeleted = true;
  try {
    const result = await SERVICE.deleteDriver(payload);
    res.status(200).json(successAction(result, Message.delUser));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call check current password service and perform error handling
 */
export const checkCurrentPassword = async (req, res, next) => {
  try {
    const payload = req.body;
    payload["_id"] = req.user.userId;
    const data = await SERVICE.checkCurrentPassword(payload);
    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(failAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call change password service and perform error handling
 */
export const changePassword = async (req, res, next) => {
  let payload = req.body;
  let query = { _id: req.user.userId };
  try {
    const data = await SERVICE.changePassword(query, payload);
    res.json(successAction(null, Message.passwordUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call update status service and perform error handling
 */
export const updateStatus = async (req, res, next) => {
  try {
    const data = await SERVICE.updateStatus(req.body);
    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call remove user service and perform error handling
 */
export const remove = async (req, res, next) => {
  try {
    const data = await SERVICE.remove(req.params);
    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get user details service and perform error handling
 */

export const getById = async (req, res, next) => {
  try {
    const data = await SERVICE.getById(req.params);
    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call verify email service and perform error handling
 */
export const emailVerify = async (req, res, next) => {
  try {
    const data = await SERVICE.emailVerify(req.body);
    if (data) {
      res.json(successAction(Message.emailVerify));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call verify phone service and perform error handling
 */
export const phoneVerify = async (req, res, next) => {
  try {
    const data = await SERVICE.phoneVerify(req.body);
    if (data) {
      res.json(successAction(data, Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call resend email token service and perform error handling
 */
export const resendEmailToken = async (req, res, next) => {
  try {
    const data = await SERVICE.resendEmailToken(req.body);
    if (data) {
      res.json(successAction(data, Message.emailResendToken));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call resend phone token service and perform error handling
 */
export const resendPhoneToken = async (req, res, next) => {
  try {
    const data = await SERVICE.resendPhoneToken(req.body);
    if (data) {
      res.json(successAction(data, Message.phoneResendToken));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call reset password  service and perform error handling
 */
export const resetPassword = async (req, res, next) => {
  try {
    const data = await SERVICE.resetPassword(req.body);
    if (data) {
      res.json(successAction(data, Message.passwordUpdated));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add driver service and perform error handling
 */
export const addDriver = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.saveDriver(req.user, payload);
    res.status(200).json(successAction(result, Message.driverAdded));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call get user terms service and perform error handling
 */
export const getTerms = async (req, res, next) => {
  try {
    const data = await Terms.find();
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call notificationsetting service and perform error handling
 */
export const updateNotificationSetting = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.userId = req.user.userId;
    payload.appUrl = `${req.protocol}://${req.headers.host}`;
    const data = await SERVICE.updateProfile(payload);
    res.status(200).json(successAction(data, Message.updateNotifictionSetting));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const getAllUsers = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.getAllUsers(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const addUser = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.addUser(payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const dashboard = async (req, res, next) => {
  //const payload = req.user;
  try {
    const rest = await SERVICE.dashboard(req.user);
    res.status(200).json(successAction(rest, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const globalSearch = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.globalSearch(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};



export const validateToken = async (req, res, next) => {
  try {
    const data = await SERVICE.validateToken(req.body);
    if (data) {
      res.json(successAction(data,Message.success));
    } else {
      res.json(successAction([]));
    }
  } catch (error) {
    res.json(failAction(error.message));
  }
};
