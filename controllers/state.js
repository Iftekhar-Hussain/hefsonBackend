/*
 * @file: truck.js
 * @description: It Contain function layer for states controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/state";
import Message from "../utilities/messages";


/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to get list of states
 */
export const list = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.list(payload);
      res.status(200).json(successAction(result, Message.stateList));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
