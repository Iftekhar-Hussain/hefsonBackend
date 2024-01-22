/*
 * @file: notification.js
 * @description: It Contain function layer for notification controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/notification";
import Message from "../utilities/messages";

export const list = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.list(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const getAll = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.getAll(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const markAsRead = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.markAsRead(req.user, payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };


  export const clearNotification = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.clearNotification(req.user, payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  