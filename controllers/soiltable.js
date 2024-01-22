/*
 * @file: soiltable.js
 * @description: It Contain function layer for soiltable controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/soiltable";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add soiltable service and perform error handling
 */
export const add = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.save(req.user, payload);
    res.status(200).json(successAction(result, Message.soiltableAdded));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit soiltable service and perform error handling
 */
export const edit = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.update(req.user, payload);
    res.status(200).json(successAction(result, Message.soiltableUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const approveProduct = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.approveProduct(req.user, payload);
    res.status(200).json(successAction(result, Message.soiltableUpdated));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};


//   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call list of all soiltable service and perform error handling
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


export const detailSoiltable = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.detailSoiltable(req.user,payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const userCategory = async (req, res, next) => {
  const payload = req.query;
  try {
    const result = await SERVICE.userCategory(req.user,payload);
    res.status(200).json(successAction(result, Message.success));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};

export const addTimeline = async (req, res, next) => {
  const payload = req.body;
  try {
    const result = await SERVICE.addTimeline(req.user, payload);
    res.status(200).json(successAction(result, Message.soiltableAdded));
  } catch (error) {
    res.status(400).json(failAction(error.message));
  }
};