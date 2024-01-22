/*
 * @file: index.js
 * @description: It's combine all truck routers.
 * @author: Aditi Goel
 */

import add from "./add";
import edit from "./edit";
import deleteTruck from "./delete";
import getDetail from "./getDetail";
import getAllTruck from "./getAllTrucks";
import updateStatus from "./updateStatus";

export default [add, edit, deleteTruck, getDetail, getAllTruck, updateStatus];
