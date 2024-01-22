"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _addShipment = _interopRequireDefault(require("./addShipment"));

var _list = _interopRequireDefault(require("./list"));

var _detail = _interopRequireDefault(require("./detail"));

var _update = _interopRequireDefault(require("./update"));

var _delete = _interopRequireDefault(require("./delete"));

var _status = _interopRequireDefault(require("./status"));

var _inactive = _interopRequireDefault(require("./inactive"));

var _downloadxls = _interopRequireDefault(require("./downloadxls"));

var _completeShipmentDetail = _interopRequireDefault(require("./completeShipmentDetail"));

var _alarm = _interopRequireDefault(require("./alarm"));

var _shareLink = _interopRequireDefault(require("./shareLink"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all shipment routers.
 * @author: Ankit Kumar Gautam
 */
var _default = [_addShipment.default, _list.default, _detail.default, _update.default, _delete.default, _status.default, _inactive.default, _completeShipmentDetail.default, _downloadxls.default, _alarm.default, _shareLink.default];
exports.default = _default;