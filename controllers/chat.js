/*
 * @file: category.js
 * @description: It Contain function layer for category controller.
 * @author: Aditi Goel
 */
import mongoose from "mongoose";
import { successAction, failAction } from "../utilities/response";
import * as SERVICE from "../services/chat";
import Message from "../utilities/messages";

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call 
 */
export const createGroup = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.createGroup(req.user, payload);
      res.status(200).json(successAction(result, Message.groupCreated));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  export const getInbox = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.getInbox(req.user, payload);
      res.status(200).json(successAction(result, "Message Inbox"));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  

  export const messageListing = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.messageListing(req.user, payload);
      res.status(200).json(successAction(result, "Message Listing"));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  export const clearChat = async (req, res, next) => {
    const payload = req.body;
    try {
      const result = await SERVICE.clearChat(req.user, payload);
      res.status(200).json(successAction(result, "Chat clear successfully"));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };

  export const getAllUsers = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.getAllUsers(req.user, payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };


  export const findThreadId = async (req, res, next) => {
    const payload = req.query;
    try {
      const result = await SERVICE.findThreadId(req.user, payload);
      res.status(200).json(successAction(result, Message.success));
    } catch (error) {
      res.status(400).json(failAction(error.message));
    }
  };
  findThreadId