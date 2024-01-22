/*
 * @file: shipment.js
 * @description: It Contain function layer for shipment controller.
 * @author: Ankit Kumar Gautam
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/shipment";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add shipment service and perform error handling
 */
export const addShipment = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.carrierId = req.user.userId;
    const data = await SERVICE.addShipment(payload);
    if (data.status == 400) {
      if (data.message == "trailer") {
        res.status(400).json(failAction("Trailer is already in use"));
      } else {
        res.status(400).json(failAction("Truck is already in use"));
      }
    } else {
      res.status(200).json(successAction(data, Message.shipmentAdded));
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
 * @description - controller to call list shipment service and perform error handling
 */
export const listShipment = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.listShipment(req.user, payload);
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
 * @description - controller to call detail shipment service and perform error handling
 */
export const detailShipment = async (req, res, next) => {
  const payload = req.query;
  try {
    // payload.userId = req.user.userId;
    const data = await SERVICE.detailShipment(req.user, payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const completeShipmentDetail = async (req, res, next) => {
  const payload = req.query;
  try {
    // payload.userId = req.user.userId;
    const data = await SERVICE.completeShipmentDetail(req.user, payload);
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
export const updateShipment = async (req, res, next) => {
  try {
    const payload = req.body;
    payload.carrierId = req.user.userId;
    const data = await SERVICE.updateShipment(payload);
    if (data.status == 400) {
      if (data.message == "trailer") {
        res.status(400).json(failAction("Trailer is already in use"));
      } else {
        res.status(400).json(failAction("Truck is already in use"));
      }
    } else {
      res.status(200).json(successAction(data, Message.success));
    }
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const updateStatus = async (req, res, next) => {
  const payload = req.body;
  payload.userId = req.user.userId;
  try {
    const result = await SERVICE.updateStatus(payload);
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
 * @description - controller to call delete Shipment service and perform error handling
 */
export const deleteShipment = async (req, res, next) => {
  const payload = req.body;
  payload.isDeleted = true;
  try {
    const result = await SERVICE.deleteShipment(payload);
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
 * @description - controller to call active shipment service and perform error handling
 */
export const listActiveShipment = async (req, res, next) => {
  const payload = req.body;
  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listActiveShipment(payload);
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
 * @description - controller to call inactive shipment service and perform error handling
 */
export const listInactiveShipment = async (req, res, next) => {
  const payload = req.body;
  try {
    payload.userId = req.user.userId;
    const data = await SERVICE.listInactiveShipment(payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const listAlarm = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.listAlarm(req.user, payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const downloadXls = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.downloadxls(req.user, payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const shareLink = async (req, res, next) => {
  const payload = req.body;
  try {
    const data = await SERVICE.shareLink(req.user, payload);
    res.status(200).json(successAction(data, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};