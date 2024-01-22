"use strict";

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = void 0;

var _mongoose = _interopRequireDefault(require("mongoose"));

var _dbSchema = _interopRequireDefault(require("./db-schema"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/*
 * @file: index.js
 * @description: It Contain function layer for user collection.
 * @author: Ankit Kumar Gautam
 */
class UserClass {
  static checkToken(token) {
    return this.findOne({
      loginToken: token
    });
  }

  static logout(userId) {
    return this.findOneAndUpdate({
      _id: userId
    }, {
      loginToken: ""
    });
  }

  static checkEmail(email) {
    var obj = {
      email
    };
    return this.findOne(obj);
  }

  static saveUser(payload) {
    return this(payload).save();
  }

  static saveManyUser(payload) {
    return this.insertMany(payload);
  }

  static findOneByCondition(condition) {
    return this.findOne(condition);
  }

  static findByCondition(condition) {
    return this.find(condition);
  }

  static update(payload) {
    const updateData = {
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.userId, updateData, {
      new: true
    });
  }

  static updateUser(payload) {
    let updateData = {
      $set: { ...payload
      }
    };
    console.log('up', updateData);
    return this.findByIdAndUpdate(payload.userId, updateData, {
      new: true
    });
  }

  static deleteUser(payload) {
    let updateData = {
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.userId, updateData, {
      new: true
    });
  }

  static updateUserStatus(payload) {
    console.log('payload', payload);
    let updateData = {
      $set: { ...payload
      }
    };
    return this.findByIdAndUpdate(payload.id, updateData, {
      new: true
    });
  }

  static findListDrivers(payload, match, sortBy, sortValue) {
    const query = [{
      $match: match
    }, {
      $lookup: {
        from: "protfolios",
        let: {
          id: "$_id"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$driverId", "$$id"]
            }
          }
        }],
        as: "driverProtfolio"
      }
    }, {
      $unwind: {
        path: "$driverProtfolio",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $project: {
        address: 1,
        city: 1,
        createdAt: 1,
        deviceId: 1,
        deviceType: 1,
        driverId: 1,
        email: 1,
        emailVerification: 1,
        fullName: 1,
        isActive: 1,
        isDeleted: 1,
        isEmailVerified: 1,
        issuedState: 1,
        licenseExp: 1,
        licenseNo: 1,
        loginToken: 1,
        mobile: 1,
        image: 1,
        id: 1,
        phone: 1,
        password: 1,
        postalcode: 1,
        resetPasswordToken: 1,
        role: 1,
        state: 1,
        updatedAt: 1,
        driverProtfolio: 1,
        insensitive: {
          $toLower: `$${sortBy}`
        }
      }
    }, {
      $sort: {
        insensitive: sortValue
      }
    }];
    const pagination = [{
      $skip: payload.pageNum ? (payload.pageNum - 1) * payload.limit : 0
    }, {
      $limit: payload.limit
    }];
    const aggregateQuery = this.aggregate([...query, ...pagination]);
    return {
      list: aggregateQuery,
      totalRecords: this.aggregate([...query])
    };
  }

  static detailDriver(payload, match) {
    const query = [{
      $match: match
    }, {
      $lookup: {
        from: "protfolios",
        let: {
          id: "$_id"
        },
        pipeline: [{
          $match: {
            $expr: {
              $eq: ["$driverId", "$$id"]
            }
          }
        }],
        as: "driverProtfolio"
      }
    }, {
      $unwind: {
        path: "$driverProtfolio",
        preserveNullAndEmptyArrays: true
      }
    }, {
      $project: {
        address: 1,
        city: 1,
        createdAt: 1,
        deviceId: 1,
        deviceType: 1,
        driverId: 1,
        email: 1,
        emailVerification: 1,
        fullName: 1,
        isActive: 1,
        isDeleted: 1,
        isEmailVerified: 1,
        issuedState: 1,
        licenseExp: 1,
        licenseNo: 1,
        loginToken: 1,
        image: 1,
        id: 1,
        mobile: 1,
        password: 1,
        postalcode: 1,
        phone: 1,
        resetPasswordToken: 1,
        role: 1,
        state: 1,
        updatedAt: 1,
        driverProtfolio: 1
      }
    }];
    const aggregateQuery = this.aggregate([...query]);
    return aggregateQuery;
  }

}

_dbSchema.default.loadClass(UserClass);

var _default = _mongoose.default.model("users", _dbSchema.default);

exports.default = _default;