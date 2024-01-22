"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findThreadId = exports.getAllUsers = exports.clearChat = exports.messageListing = exports.getInbox = exports.createGroup = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _response = require("../utilities/response");

var SERVICE = _interopRequireWildcard(require("../services/chat"));

var _messages = _interopRequireDefault(require("../utilities/messages"));

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: category.js
 * @description: It Contain function layer for category controller.
 * @author: Aditi Goel
 */

/**
 *
 * @param {*} req
 * @param {*} res
 * @param {*} next
 * @description - controller to call 
 */
const createGroup = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.createGroup(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.groupCreated));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.createGroup = createGroup;

const getInbox = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.getInbox(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, "Message Inbox"));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getInbox = getInbox;

const messageListing = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.messageListing(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, "Message Listing"));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.messageListing = messageListing;

const clearChat = async (req, res, next) => {
  const payload = req.body;

  try {
    const result = await SERVICE.clearChat(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, "Chat clear successfully"));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.clearChat = clearChat;

const getAllUsers = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.getAllUsers(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.getAllUsers = getAllUsers;

const findThreadId = async (req, res, next) => {
  const payload = req.query;

  try {
    const result = await SERVICE.findThreadId(req.user, payload);
    res.status(200).json((0, _response.successAction)(result, _messages.default.success));
  } catch (error) {
    res.status(400).json((0, _response.failAction)(error.message));
  }
};

exports.findThreadId = findThreadId;
findThreadId;