/*
 * @file: promotions.js
 * @description: It Contain function layer for promotions controller.
 * @author: smartData
 */

import Message from "../utilities/messages";
import { successAction, failAction } from "../utilities/response";
import * as COMMON from "../services/common";

const uploaderObj = require('../utilities/uploading');

/*   */
/**
 * 
 * @param {*} req 
 * @description - Make string slug 
 */
export const createSlug = async req => {
  req = req.replace(/\s+/g, "-");
  req = req
    .replace(/[`~!@#$%^&*()_\+=\[\]{};:"\\|\/,'.<>?\s]/g, "")
    .toLowerCase();
  return req;
};