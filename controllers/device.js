/*
 * @file: truck.js
 * @description: It Contain function layer for devices controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/device";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to get list of alldevices
 */
export const list = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.list(req.user, payload);
    res.status(200).json(successAction(result, Message.devicelist));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const getDetail = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.getDetail(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const assignSensor = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.assignSensor(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const downloadXls = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.downloadxls(req.user, payload);
    console.log('data1',data)
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};