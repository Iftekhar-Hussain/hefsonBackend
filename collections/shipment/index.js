/*
 * @file: index.js
 * @description: It Contain function layer for Shipment collection.
 * @author: Ankit Kumar Gautam
 */

import Mongoose from "mongoose";
import DbSchema from "./db-schema";

class ShipmentClass {
  static saveShipment(payload) {
    return this(payload).save();
  }
  static saveManyShipment(payload) {
    return this.insertMany(payload);
  }
  static findOneByCondition(condition) {
    return this.findOne(condition);
  }
  static findByCondition(condition) {
    return this.find(condition);
  }
  static updateShipment(payload) {
    const updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.id, updateData, { new: true });
  }
  static listShipment(user, payload, match, sortBy, sortValue) {
    const query = [
      { $match: match },
      {
        $lookup: {
          from: "trailers",
          localField: "trailerId",
          foreignField: "_id",
          as: "trailerData",
        },
      },
      { $unwind: "$trailerData" },
      {
        $lookup: {
          from: "sensors",
          localField: "trailerData.sensorId",
          foreignField: "_id",
          as: "sensorData",
        },
      },
      { $unwind: "$sensorData" },
      {
        $lookup: {
          from: "trucks",
          localField: "truckId",
          foreignField: "_id",
          as: "truckData",
        },
      },
      { $unwind: "$truckData" },
      {
        $lookup: {
          from: "historys",
          localField: "_id",
          foreignField: "shipmentId",
          as: "historyData",
        },
      },
      {
        $lookup: {
          from: "alarms",
          localField: "_id",
          foreignField: "shipmentId",
          as: "alarmData",
        },
      },
      { $sort: { createdAt: -1 } },
    ];
    let limit = payload.limit ? JSON.parse(payload.limit) : 20;
    payload.pageNum = payload.pageNum ? payload.pageNum : 1;
    let skip = JSON.parse((payload.pageNum - 1) * limit);

    // const pagination = [
    //   { $skip: payload.pageNum ? (payload.pageNum - 1) * payload.limit : 0 },
    //   { $limit: payload.limit },
    // ];
    //  const aggregateQuery = this.aggregate([...query, ...pagination]);
    let count = this.aggregate(query);

    query.push({ $skip: skip });
    query.push({ $limit: limit });
    let shipmentList = this.aggregate(query);
    return {
      list: shipmentList,
      totalRecords: count,
    };
  }
  static detailShipment(payload, match) {
    const query = [
      { $match: match },
      {
        $lookup: {
          from: "trailers",
          localField: "trailerId",
          foreignField: "_id",
          as: "trailerData",
        },
      },
      { $unwind: "$trailerData" },
      {
        $lookup: {
          from: "manufactures",
          localField: "trailerData.manufacturer",
          foreignField: "_id",
          as: "trailerData.manuData",
        },
      },
      { $unwind: "$trailerData.manuData" },
      {
        $lookup: {
          from: "sensors",
          localField: "trailerData.sensorId",
          foreignField: "_id",
          as: "sensorData",
        },
      },
      { $unwind: "$sensorData" },
      {
        $lookup: {
          from: "trucks",
          localField: "truckId",
          foreignField: "_id",
          as: "truckData",
        },
      },
      { $unwind: "$truckData" },
      {
        $lookup: {
          from: "manufactures",
          localField: "truckData.manufacture",
          foreignField: "_id",
          as: "truckData.manuData",
        },
      },
      { $unwind: "$truckData.manuData" },
      {
        $lookup: {
          from: "users",
          localField: "driverId",
          foreignField: "_id",
          as: "driverData",
        },
      },
      { $unwind: "$driverData" },
      {
        $lookup: {
          from: "protfolios",
          localField: "driverData._id",
          foreignField: "driverId",
          as: "driverData.protfolio",
        },
      },
      { $unwind: "$driverData.protfolio" },
      {
        $lookup: {
          from: "users",
          localField: "carrierId",
          foreignField: "_id",
          as: "carrierData",
        },
      },
      { $unwind: "$carrierData" },
      {
        $lookup: {
          from: "historys",
          localField: "_id",
          foreignField: "shipmentId",
          as: "historyData",
        },
      },
    ];

    const aggregateQuery = this.aggregate([...query]);
    return aggregateQuery;
  }
  static deleteShipment(payload) {
    let updateData = {
      $set: {
        ...payload,
      },
    };
    return this.findByIdAndUpdate(payload.shipmentId, updateData, {
      new: true,
    });
  }

  static listActiveShipment(payload, match, sortBy, sortValue) {
    const query = [
      { $match: match },
      { $unwind: { path: "$shipper" } },
      {
        $group: {
          _id: "$shipper.loadId",
          pickupName: { $first: "$shipper.pickupName" },
          pickupAddress: { $first: "$shipper.pickupAddress" },
          pickupDate: { $first: "$shipper.pickupDate" },
          pickupTime: { $first: "$shipper.pickupTime" },
          poNumber: { $first: "$shipper.poNumber" },
          receiver: { $first: "$receiver" },
          unitNumber: { $first: "$unitNumber" },
          manufacturer: { $first: "$manufacturer" },
          modelYearTruck: { $first: "$modelYearTruck" },
          truckColor: { $first: "$truckColor" },
          issuedStateTruck: { $first: "$issuedStateTruck" },
          registrationExpDateTruck: { $first: "$registrationExpDateTruck" },
          numberPlateTruck: { $first: "$numberPlateTruck" },
          trailerNumber: { $first: "$trailerNumber" },
          numberPlateTrailer: { $first: "$numberPlateTrailer" },
          modelYearTrailer: { $first: "$modelYearTrailer" },
          issuedStateTrailer: { $first: "$issuedStateTrailer" },
          registrationExpDateTrailer: { $first: "$registrationExpDateTrailer" },
          driverName: { $first: "$driverName" },
          driverHefsonId: { $first: "$driverHefsonId" },
          licenseNumber: { $first: "$licenseNumber" },
          licenseExp: { $first: "$licenseExp" },
          issuedState: { $first: "$issuedState" },
          driverPhone: { $first: "$driverPhone" },
          temperature: { $first: "$temperature" },
          referenceNumber: { $first: "$referenceNumber" },
          comment: { $first: "$comment" },
          broker: { $first: "$broker" },
          brokerAgent: { $first: "$brokerAgent" },
          brokerPhone: { $first: "$brokerPhone" },
          brokerhefsonId: { $first: "$brokerhefsonId" },
          carrierName: { $first: "$carrierName" },
          dotNumber: { $first: "$dotNumber" },
          dispatchName: { $first: "$dispatchName" },
          carrierPhone: { $first: "$carrierPhone" },
          carrierEmergencyPhone: { $first: "$carrierEmergencyPhone" },
          unitNumber: { $first: "$unitNumber" },
        },
      },
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
}

DbSchema.loadClass(ShipmentClass);

export default Mongoose.model("Shipments", DbSchema);
