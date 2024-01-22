/*
 * @file: index.js
 * @description: It's combine all category routers.
 * @author: Aditi Goel
 */

import add from "./add";
import edit from "./edit";
import deleteCategory from "./delete";
import detail from "./detail";
import list from "./list";
import requestCat from "./request";
import listRequest from "./listRequest";
import approveRequestCat from "./approveRequestCat";
import changeStatus from "./changeStatus";
import editRequest from "./editRequest";

export default [
  add,
  edit,
  deleteCategory,
  detail,
  list,
  requestCat,
  listRequest,
  approveRequestCat,
  changeStatus,
  editRequest
];
