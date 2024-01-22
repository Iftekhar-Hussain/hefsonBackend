"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _add = _interopRequireDefault(require("./add"));

var _edit = _interopRequireDefault(require("./edit"));

var _delete = _interopRequireDefault(require("./delete"));

var _getDetail = _interopRequireDefault(require("./getDetail"));

var _getAllTrailer = _interopRequireDefault(require("./getAllTrailer"));

var _updateStatus = _interopRequireDefault(require("./updateStatus"));

var _addEvent = _interopRequireDefault(require("./addEvent"));

var _resetHours = _interopRequireDefault(require("./resetHours"));

var _getMapData = _interopRequireDefault(require("./getMapData"));

var _downloadxls = _interopRequireDefault(require("./downloadxls"));

var _getDeviceMapData = _interopRequireDefault(require("./getDeviceMapData"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all trailer routers.
 * @author: Aditi Goel
 */
var _default = [_add.default, _edit.default, _delete.default, _getDetail.default, _getAllTrailer.default, _updateStatus.default, _addEvent.default, _resetHours.default, _getMapData.default, _downloadxls.default, _getDeviceMapData.default];
exports.default = _default;