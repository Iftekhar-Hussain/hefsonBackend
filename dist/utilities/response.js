"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.failAction = exports.successAction = void 0;

/*
 * @file: response.js
 * @description: It Contain function layer for api response status with data.
 * @author: Aditi Goel
 */
const successAction = (data, message = 'OK') => {
  return {
    status: 200,
    data,
    message
  };
};

exports.successAction = successAction;

const failAction = (message = 'Fail', status = 400) => {
  return {
    status,
    data: null,
    message
  };
};

exports.failAction = failAction;