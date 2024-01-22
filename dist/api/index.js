"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _user = _interopRequireDefault(require("./v1/user"));

var _truck = _interopRequireDefault(require("./v1/truck"));

var _trailer = _interopRequireDefault(require("./v1/trailer"));

var _soiltable = _interopRequireDefault(require("./v1/soiltable"));

var _category = _interopRequireDefault(require("./v1/category"));

var _file = _interopRequireDefault(require("./v1/file"));

var _shipment = _interopRequireDefault(require("./v1/shipment"));

var _randomimage = _interopRequireDefault(require("./v1/randomimage"));

var _qrcode = _interopRequireDefault(require("./v1/qrcode"));

var _driver = _interopRequireDefault(require("./v1/driver"));

var _devices = _interopRequireDefault(require("./v1/devices"));

var _manufacture = _interopRequireDefault(require("./v1/manufacture"));

var _states = _interopRequireDefault(require("./v1/states"));

var _chat = _interopRequireDefault(require("./v1/chat"));

var _notification = _interopRequireDefault(require("./v1/notification"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Aditi Goel
 */

/*********** Combine all Routes ********************/
var _default = [..._user.default, ..._truck.default, ..._trailer.default, ..._soiltable.default, ..._category.default, ..._file.default, ..._shipment.default, ..._randomimage.default, ..._qrcode.default, ..._driver.default, ..._devices.default, ..._manufacture.default, ..._states.default, ..._chat.default, ..._notification.default];
exports.default = _default;