/*
 * @file: file.js
 * @description: It Contain function layer for file controller.
 * @author: Ankit Kumar Gautam
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/file";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call upload file service and perform error handling
 */
export const uploadImage = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.userId = req.user.userId;
    payload.files = req.files;
    payload.appUrl = `${req.protocol}://${req.headers.host}`;
    const data = await SERVICE.uploadImage(payload);
    res.status(200).json(successAction(data, Message.fileUpload));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};
