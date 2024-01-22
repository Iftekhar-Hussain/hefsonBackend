/*
 * @file: index.js
 * @description: It's combine all user routers.
 * @author: Aditi Goel
 */

import addDriver from "./addDriver";
import updateDriver from "./update-driver";
import listDrivers from "./list-drivers";
import detailDriver from "./detail-driver";
import deleteDriver from "./delete-driver";
import updateStatus from "./updateStatus";

export default [
  addDriver,
  updateDriver,
  listDrivers,
  detailDriver,
  deleteDriver,
  updateStatus
];
