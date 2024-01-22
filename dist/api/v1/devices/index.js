"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _list = _interopRequireDefault(require("./list"));

var _detail = _interopRequireDefault(require("./detail"));

var _assignSensor = _interopRequireDefault(require("./assignSensor"));

var _downloadxls = _interopRequireDefault(require("./downloadxls"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all device routers.
 * @author: Aditi Goel
 */
var _default = [_list.default, _detail.default, _assignSensor.default, _downloadxls.default];
exports.default = _default;