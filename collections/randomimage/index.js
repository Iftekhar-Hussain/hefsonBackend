/*
 * @file: index.js
 * @description: It Contain function layer for Randomimage collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class RandomimageClass {
  static saveRandomimage(payload) {
    return this(payload).save();
  }
  static saveManyRandomimage(payload) {
    return this.insertMany(payload);
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition) {
    return this.find(condition);
  }
  static updateRandomimage(payload) {
    const updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.id, updateData, { new: true });
  }
  static listRandomimage(payload, match, sortBy, sortValue) {
    const query = [
      {
        $project: {
          randomTime: 1,
          imageLink: 1,
          isDeleted: 1,
          category: 1,
          createdAt: 1,
          updatedAt: 1,
          insensitive: { $toLower: `$${sortBy}` },
        },
      },
      { $match: match },
      {
        $group: {
          _id: "$category",
          randomimage: { $push: "$$ROOT" },
        },
      },
      { $sort: { insensitive: sortValue } },
    ];
    const pagination = [
      { $skip: payload.pageNum ? (payload.pageNum - 1) * payload.limit : 0 },
      { $limit: payload.limit },
    ];
    const aggregateQuery = this.aggregate([...query, ...pagination]);
    return {
      list: aggregateQuery,
      totalRecords: this.aggregate([...query]),
    };
  }
  static detailRandomimage(payload, match) {
    const query = [{ $match: match }];

    const aggregateQuery = this.aggregate([...query]);
    return aggregateQuery;
  }
  static deleteRandomimage(payload) {
    let updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.randomImageId, updateData, {
      new: true,
    });
  }
}

DbSchema.loadClass(RandomimageClass);

export default Mongoose.model("Randomimages", DbSchema);
