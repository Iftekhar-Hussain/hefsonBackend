"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _add = _interopRequireDefault(require("./add"));

var _edit = _interopRequireDefault(require("./edit"));

var _delete = _interopRequireDefault(require("./delete"));

var _detail = _interopRequireDefault(require("./detail"));

var _list = _interopRequireDefault(require("./list"));

var _request = _interopRequireDefault(require("./request"));

var _listRequest = _interopRequireDefault(require("./listRequest"));

var _approveRequestCat = _interopRequireDefault(require("./approveRequestCat"));

var _changeStatus = _interopRequireDefault(require("./changeStatus"));

var _editRequest = _interopRequireDefault(require("./editRequest"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It's combine all category routers.
 * @author: Aditi Goel
 */
var _default = [_add.default, _edit.default, _delete.default, _detail.default, _list.default, _request.default, _listRequest.default, _approveRequestCat.default, _changeStatus.default, _editRequest.default];
exports.default = _default;