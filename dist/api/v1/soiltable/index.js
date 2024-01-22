"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _add = _interopRequireDefault(require("./add"));

var _edit = _interopRequireDefault(require("./edit"));

var _list = _interopRequireDefault(require("./list"));

var _detail = _interopRequireDefault(require("./detail"));

var _userCategory = _interopRequireDefault(require("./userCategory"));

var _addTimeLine = _interopRequireDefault(require("./addTimeLine"));

var _approveProduct = _interopRequireDefault(require("./approveProduct"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all soiltable routers.
 * @author: Aditi Goel
 */
var _default = [_add.default, _edit.default, _list.default, _detail.default, _userCategory.default, _addTimeLine.default, _approveProduct.default];
exports.default = _default;