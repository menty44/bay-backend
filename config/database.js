/*eslint strict: ["error", "global"]*/

'use strict';

// Set up mongoose connection
const mongoose = require('mongoose');
const mongoDB = 'mongodb://localhost/hackerBay';
mongoose.connect(mongoDB);
mongoose.Promise = global.Promise;

module.exports = mongoose;
