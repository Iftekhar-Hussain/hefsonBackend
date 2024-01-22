/*
 * @file: index.js
 * @description: It's combine all file upload routers.
 * @author: Ankit Kumar Gautam
 */

import upload from "./upload";
import list from "./list";
import update from "./update";
import deleteRandomImage from "./delete";

export default [upload, list, update, deleteRandomImage];
