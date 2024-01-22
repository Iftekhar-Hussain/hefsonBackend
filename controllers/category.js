/*
 * @file: category.js
 * @description: It Contain function layer for category controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/category";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call add category service and perform error handling
 */
export const add = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.save(req.user, payload);
      res.status(200).json(successAction(result, Message.categoryAdded));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  

  export const requestCat = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.requestCat(req.user, payload);
      res.status(200).json(successAction(result, Message.categoryRequested));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  /**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call edit category service and perform error handling
 */
export const edit = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.edit(payload);
      res.status(200).json(successAction(result, Message.categoryUpdated));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  export const editRequestCat = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.editRequestCat(payload);
      res.status(200).json(successAction(result, Message.categoryUpdated));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  


  /**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call soft delete category service and perform error handling
 */
export const deleteCategory = async (req, res, next) => {
    const payload = req.params;
    try {
      const result = await SERVICE.deleteCategory(payload);
      res.status(200).json(successAction(result, Message.delCat));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  
//   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call detail of trailer service and perform error handling
//    */
  export const detail = async (req, res, next) => {
    const payload = req.params;
    try {
      const result = await SERVICE.detail(payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  
//   /**
//    *
//    * @param {*} req
//    * @param {*} res
//    * @param {*} next
//    * @description - controller to call list of all catgeory service and perform error handling
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
  
  export const listRequest = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.listRequest(req.user,payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  
  export const updateStatus = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.updateStatus(payload);
      res.status(200).json(successAction(result, Message.categoryUpdated));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };


  export const approveRequestCat = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.approveRequestCat(payload);
      res.status(200).json(successAction(result, Message.categoryUpdated));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  