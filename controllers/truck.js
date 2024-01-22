/*
 * @file: truck.js
 * @description: It Contain function layer for truck controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/truck";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add truck service and perform error handling
 */
export const add = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.save(req.user, payload);
    res.status(200).json(successAction(result, Message.truckAdded));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit truck service and perform error handling
 */
export const edit = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.edit(req.user, payload);
    res.status(200).json(successAction(result, Message.truckUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call soft delete truck service and perform error handling
 */
export const deleteTruck = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.deleteTruck(payload);
    res.status(200).json(successAction(result, Message.truckDeleted));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call detail of truck service and perform error handling
 */
export const getDetail = async (req, res, next) => {
  const payload = req.params;
  try {
    const result = await SERVICE.getDetail(payload);
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
 * @description - controller to call list of all truck service and perform error handling
 */
export const getAllTrucks = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.getAllTrucks(req.user, payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


export const updateStatus = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.updateStatus(req.user, payload);
    res.status(200).json(successAction(result, Message.truckUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};