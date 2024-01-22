/*
 * @file: index.js
 * @description: It's combine all device routers.
 * @author: Aditi Goel
 */

import createGroup from "./createGroup";
import inbox from "./inbox";
import listing from "./listing";
import clearChat from "./clearChat";
import userSearch from "./userSearch";
import findThreadId from "./findThreadId";

export default [
  createGroup,
  inbox,
  listing,
  clearChat,
  userSearch,
  findThreadId,
];
