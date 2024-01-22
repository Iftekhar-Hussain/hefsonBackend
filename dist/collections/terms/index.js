"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbSchema = _interopRequireDefault(require("./db-schema"));

var _constants = require("../../utilities/constants");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It Contain function layer for Terms collection.
 * @author: Shiv Kumar
 */
var ObjectId = require('mongodb').ObjectID;

class TermsClass {
  static saveTerms(payload) {
    return this(payload).save();
  }

  static updateTerms(payload) {
    let updateData = {
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.TermsId, updateData, {
      new: true
    });
  }

  static findOneByCondition(condition) {
    return this.findOne(condition);
  }

  static findTermsByCondition() {
    return this.findOne();
  }

}

_dbSchema.default.loadClass(TermsClass);

var _default = _mongoose.default.model('Terms', _dbSchema.default);

exports.default = _default;