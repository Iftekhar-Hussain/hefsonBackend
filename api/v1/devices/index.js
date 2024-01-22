/*
 * @file: index.js
 * @description: It's combine all device routers.
 * @author: Aditi Goel
 */

import list from "./list";
import detail from "./detail";
import assignSensor from "./assignSensor";
import downloadxls from "./downloadxls";

export default [
  list,
  detail,
  assignSensor,
  downloadxls
];
