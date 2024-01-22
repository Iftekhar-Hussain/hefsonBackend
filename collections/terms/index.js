/*
 * @file: index.js
 * @description: It Contain function layer for Terms collection.
 * @author: Shiv Kumar
 */

import mongoose from 'mongoose';
import dbSchema from './db-schema';
import { LIMIT, ROLE } from '../../utilities/constants';
var ObjectId = require('mongodb').ObjectID;

class TermsClass {
	static saveTerms(payload) { 
		return this(payload).save();
	}
	
	static updateTerms(payload) { 
		let updateData = {
			$set: {
				...payload
			}
		};
		return this.findByIdAndUpdate(payload.TermsId, updateData, { new: true });
	}
	
	static findOneByCondition(condition) { 
		return this.findOne(condition);
	}
	
	static findTermsByCondition() { 
		return this.findOne();
	}
}

dbSchema.loadClass(TermsClass);

export default mongoose.model('Terms', dbSchema);