/*
 * @file: index.js
 * @description: It's combine all shipment routers.
 * @author: Ankit Kumar Gautam
 */

import addShipment from "./addShipment";
import list from "./list";
import detail from "./detail";
import update from "./update";
import deleteShipment from "./delete";
import status from "./status";
import inactive from "./inactive";
import downloadXls from "./downloadxls";
import completeShipmentDetail from "./completeShipmentDetail";
import alarmList from "./alarm";
import shareLink from "./shareLink";

export default [
  addShipment,
  list,
  detail,
  update,
  deleteShipment,
  status,
  inactive,
  completeShipmentDetail,
  downloadXls,
  alarmList,
  shareLink
];
