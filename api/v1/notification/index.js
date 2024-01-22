/*
 * @file: index.js
 * @description: It's combine all notification routers.
 * @author: Aditi Goel
 */

import list from "./list";
import getAll from "./getAll";
import read from "./read";
import clearNotification from "./clear";

export default [list, read, clearNotification, getAll];
