/*
 * @file: index.js
 * @description: It's combine all trailer routers.
 * @author: Aditi Goel
 */

import add from "./add";
import edit from "./edit";
import deleteTrailer from "./delete";
import getDetail from "./getDetail";
import getAllTrailer from "./getAllTrailer";
import updateStatus from "./updateStatus";
import addEvent from "./addEvent";
import resetHours from "./resetHours";
import mapData from "./getMapData";
import downloadXls from "./downloadxls";
import getdeviceMapData from "./getDeviceMapData";

export default [
  add,
  edit,
  deleteTrailer,
  getDetail,
  getAllTrailer,
  updateStatus,
  addEvent,
  resetHours,
  mapData,
  downloadXls,
  getdeviceMapData
];
