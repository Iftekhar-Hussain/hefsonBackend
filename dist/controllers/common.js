"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.createSlug = void 0;

var _messages = _interopRequireDefault(require("../utilities/messages"));

var _response = require("../utilities/response");

var COMMON = _interopRequireWildcard(require("../services/common"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: promotions.js
 * @description: It Contain function layer for promotions controller.
 * @author: smartData
 */
const uploaderObj = require('../utilities/uploading');
/*   */

/**
 * 
 * @param {*} req 
 * @description - Make string slug 
 */


const createSlug = async req => {
  req = req.replace(/\s+/g, "-");
  req = req.replace(/[`~!@#$%^&*()_\+=\[\]{};:"\\|\/,'.<>?\s]/g, "").toLowerCase();
  return req;
};

exports.createSlug = createSlug;