/*
 * @file: qrcode.js
 * @description: It Contain function layer for qrcode controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/qrcode";
import Message from "../utilities/messages";


//   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call list of all qrcode service and perform error handling
//    */
  export const list = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.list(req.user,payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  