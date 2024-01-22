"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.checkSlug = exports.createSlug = void 0;

/*
 * @file: common.js
 * @description: It Contain common functions.
 * @author: Smartdata
 */

/**
 * 
 * @param {*} req 
 * @description - create slug values 
 */
const createSlug = async req => {
  req = req.replace(/\s+/g, "-");
  req = req.replace(/[`~!@#$%^&*()_\+=\[\]{};:"\\|\/,'.<>?\s]/g, "").toLowerCase();
  return req;
};
/**
 * 
 * @param {*} string 
 * @param {*} reqObj 
 * @param {*} model 
 * @description - check if slug value already exist in db

 */


exports.createSlug = createSlug;

const checkSlug = async (string, reqObj, model) => {
  let count = 0;
  let codeExists = await model.findOne(reqObj);

  if (codeExists) {
    reqObj.slug = `${await createSlug(string)}-${count}`;
    count = count + 1;
    return await checkSlug(string, reqObj, model);
  } else {
    count = 1;
    return reqObj.slug;
  }
};

exports.checkSlug = checkSlug;