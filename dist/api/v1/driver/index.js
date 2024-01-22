"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _addDriver = _interopRequireDefault(require("./addDriver"));

var _updateDriver = _interopRequireDefault(require("./update-driver"));

var _listDrivers = _interopRequireDefault(require("./list-drivers"));

var _detailDriver = _interopRequireDefault(require("./detail-driver"));

var _deleteDriver = _interopRequireDefault(require("./delete-driver"));

var _updateStatus = _interopRequireDefault(require("./updateStatus"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all user routers.
 * @author: Aditi Goel
 */
var _default = [_addDriver.default, _updateDriver.default, _listDrivers.default, _detailDriver.default, _deleteDriver.default, _updateStatus.default];
exports.default = _default;