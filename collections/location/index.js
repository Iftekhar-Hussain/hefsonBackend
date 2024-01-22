/*
 * @file: index.js
 * @description: It Contain function layer for Location collection.
 * @author: Ankit Kumar Gautam
 */

import mongoose from 'mongoose';
import dbSchema from './db-schema';
import { LIMIT, ROLE } from '../../utilities/constants';
var ObjectId = require('mongodb').ObjectID;

class LocationClass {
	static saveLocation(payload) {
		return this(payload).save();
	}

}

dbSchema.loadClass(LocationClass);

export default mongoose.model('Location', dbSchema);