/*
 * @file: randomimage.js
 * @description: It Contain function layer for randomimage controller.
 * @author: Ankit Kumar Gautam
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/randomimage";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call upload randomimage service and perform error handling
 */
export const uploadImage = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.userId = req.user.userId;
    payload.files = req.files;
    payload.appUrl = `${req.protocol}://${req.headers.host}`;
    const data = await SERVICE.uploadImage(payload);
    res.status(200).json(successAction(data, Message.randomImageUpload));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call list shipment service and perform error handling
 */
export const listRandomimage = async (req, res, next) => {
  const payload = req.body;
  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listRandomimage(payload);
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
 * @description - controller to call update Shipment service and perform error handling
 */
export const updateImage = async (req, res, next) => {
  const payload = req.body;
  payload.userId = req.user.userId;
  try {
    const result = await SERVICE.updateImage(payload);
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
 * @description - controller to call delete Random Image service and perform error handling
 */
export const deleteRandomImage = async (req, res, next) => {
  const payload = req.body;
  payload.isDeleted = true;
  try {
    const result = await SERVICE.deleteRandomImage(payload);
    res.status(200).json(successAction(result, Message.userUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};
