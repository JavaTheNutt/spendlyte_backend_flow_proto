const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp(functions.config().firebase);
const express = require('express');
const cookieParser = require('cookie-parser')();
const cors = require('cors')({origin: true});
const { validateFirebaseIdToken } = require('../src/auth');
const { fetchFutureFinance, mergeItems } = require('./service/financeService');
const app = express();

app.use(cors);
app.use(cookieParser);
app.use(validateFirebaseIdToken);

app.get('/income', (req, res) => {
  console.log('request recieved from', req.user);
  admin.firestore().collection(`/transactions/${req.user.sub}/incomes`).get().then((querySnapshot) => {
    // console.log('results fetched', querySnapshot);
    let results = [];
    querySnapshot.forEach(doc => {
      console.log(doc.id, '=>', doc.data());
      let obj = {
        title: doc.data().title,
        transactions:[]
      };
      obj.transactions = fetchFutureFinance(Object.assign({id: doc.id}, doc.data()));
      results.push(obj);
    });
    return res.status(200).send(results);
  }).catch(err => {
    console.log('an error has occurred', err);
    return res.status(500).send(err);
  })
});

module.exports = app;
// exports.finance = functions.https.onRequest(app);
