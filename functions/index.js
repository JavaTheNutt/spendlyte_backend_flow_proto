const functions = require('firebase-functions');
const finance = require('./finance');


exports.finance = functions.https.onRequest(finance);
