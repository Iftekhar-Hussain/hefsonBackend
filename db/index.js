/*
 * @file: index.js
 * @description: It Contain db setup function.
 * @author: Aditi Goel
 */

import mongoose from 'mongoose';
import config from 'config';
// const { auth, name, host, username, password, port ,databaseUrl} = config.get('db');
const { auth, name, host, username, password, dbport} = config.get('db');
const databaseUrl = auth ? `mongodb://${username}:${password}@${host}:${dbport}/${name}` : `mongodb://${host}:${dbport}/${name}`;//"mongodb://TruckingToolApplication:DBdhsdru4842@54.201.160.69:58173/TruckingToolApplication"
//

// Mongose setup with server
console.log("databaseUrl",databaseUrl);

mongoose.connect(databaseUrl, {
    'useCreateIndex': true,
    'useNewUrlParser': true,
    'useUnifiedTopology': true,
    'useFindAndModify': false,
});

export const connection = () => {
    mongoose.connection.on('connected', function () {
        console.log('Mongoose connected! ');
    });
}

