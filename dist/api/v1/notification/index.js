"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _list = _interopRequireDefault(require("./list"));

var _getAll = _interopRequireDefault(require("./getAll"));

var _read = _interopRequireDefault(require("./read"));

var _clear = _interopRequireDefault(require("./clear"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all notification routers.
 * @author: Aditi Goel
 */
var _default = [_list.default, _read.default, _clear.default, _getAll.default];
exports.default = _default;