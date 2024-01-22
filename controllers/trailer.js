/*
 * @file: trailer.js
 * @description: It Contain function layer for trailer controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/trailer";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add trailer service and perform error handling
 */
export const add = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.save(req.user, payload);
    if (result.status == 400) {
      res
        .status(400)
        .json(failAction("Sensor device is already assigned to other trailer"));
    } else {
      res.status(200).json(successAction(result, Message.trailerAdded));
    }
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit trailer service and perform error handling
 */
export const edit = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.edit(req.user, payload);
    if (result.status == 400) {
      res
        .status(400)
        .json(failAction("Sensor device is already assigned to other trailer"));
    } else {
      res.status(200).json(successAction(result, Message.trailerUpdated));
    }
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call soft delete trailer service and perform error handling
 */
export const deleteTrailer = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.deleteTrailer(payload);
    res.status(200).json(successAction(result, Message.trailerDeleted));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call detail of trailer service and perform error handling
 */
export const getDetail = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.getDetail(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const getMapData = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.getMapData(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const getDeviceMapData = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.getDeviceMapData(req.user, payload);
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
 * @description - controller to call list of all trailer service and perform error handling
 */
export const getAllTrailer = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.getAllTrailer(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const updateStatus = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.updateStatus(req.user, payload);
    res.status(200).json(successAction(result, Message.trailerUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add trailer event service and perform error handling
 */
export const addEvent = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.addEvent(req.user, payload);

    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const resetHour = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.resetHour(req.user, payload);
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
