/*
 * @file: index.js
 * @description: It's combine all routers.
 * @author: Aditi Goel
 */

import user from "./v1/user";
import truck from "./v1/truck";
import trailer from "./v1/trailer";
import soiltable from "./v1/soiltable";
import category from "./v1/category";
import file from "./v1/file";
import shipment from "./v1/shipment";
import randomimage from "./v1/randomimage";
import qrcode from "./v1/qrcode";
import driver from "./v1/driver";
import devices from "./v1/devices";
import manufacture from "./v1/manufacture";
import states from "./v1/states";
import chat from "./v1/chat";
import notification from "./v1/notification";
/*********** Combine all Routes ********************/
export default [
  ...user,
  ...truck,
  ...trailer,
  ...soiltable,
  ...category,
  ...file,
  ...shipment,
  ...randomimage,
  ...qrcode,
  ...driver,
  ...devices,
  ...manufacture,
  ...states,
  ...chat,
  ...notification
];
