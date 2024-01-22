"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _add = _interopRequireDefault(require("./add"));

var _edit = _interopRequireDefault(require("./edit"));

var _delete = _interopRequireDefault(require("./delete"));

var _getDetail = _interopRequireDefault(require("./getDetail"));

var _getAllTrucks = _interopRequireDefault(require("./getAllTrucks"));

var _updateStatus = _interopRequireDefault(require("./updateStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all truck routers.
 * @author: Aditi Goel
 */
var _default = [_add.default, _edit.default, _delete.default, _getDetail.default, _getAllTrucks.default, _updateStatus.default];
exports.default = _default;