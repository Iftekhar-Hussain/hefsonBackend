/*
 * @file: index.js
 * @description: It's combine all soiltable routers.
 * @author: Aditi Goel
 */

import add from "./add";
import edit from "./edit";
import list from "./list";
import detail from "./detail";
import userCategory from "./userCategory";
import addTimeline from "./addTimeLine";
import approveProduct from "./approveProduct";

export default [
  add,
  edit,
  list,
  detail,
  userCategory,
  addTimeline,
  approveProduct,
];
