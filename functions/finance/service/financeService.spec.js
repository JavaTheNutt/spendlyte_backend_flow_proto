const { expect } = require('chai');
const { fetchFutureFinance, isFuture, mergeItems } = require('./financeService');
const moment = require('moment');

describe('financeService', ()=>{
  describe('fetchFutureFinance', () => {
    it('should return sporadic transactions wrapped in an array', () => {
      const transaction = {
        amount: 564665,
        frequency: "Sporadic",
        id: "90gvsd55J5JUPAPsC5t1",
        nextDueDate: "2018-01-31",
        title: "wages"
      };
      const result = fetchFutureFinance(transaction);
      expect(result).to.eql([transaction]);
    });
    it('should return once transactions wrapped in an array', () => {
      const transaction = {
        amount: 564665,
        frequency: "Once",
        id: "90gvsd55J5JUPAPsC5t1",
        nextDueDate: "2018-01-31",
        title: "wages"
      };
      const result = fetchFutureFinance(transaction);
      expect(result).to.eql([transaction]);
    });
    it('should return a years worth of monthly transactions', () => {
      const transaction = {
        amount: 564665,
        frequency: "Monthly",
        id: "90gvsd55J5JUPAPsC5t1",
        nextDueDate: "2018-01-31",
        title: "wages"
      };
      const result = fetchFutureFinance(transaction);
      expect(result.length).to.eql(12);
    });
    it('should return a years worth of weekly transactions', () => {
      const transaction = {
        amount: 564665,
        frequency: "Weekly",
        id: "90gvsd55J5JUPAPsC5t1",
        nextDueDate: "2018-01-31",
        title: "wages"
      };
      const result = fetchFutureFinance(transaction);
      expect(result.length).to.eql(52);
    });
    it('should return a years worth of daily transactions', () => {
      const transaction = {
        amount: 564665,
        frequency: "Daily",
        id: "90gvsd55J5JUPAPsC5t1",
        nextDueDate: "2018-01-31",
        title: "wages"
      };
      const result = fetchFutureFinance(transaction);
      expect(result.length).to.eql(365);
    });
  });
  describe('isFuture', () => {
    it('should return true when the date is after today', () => {
      const record = { nextDueDate: moment().add(10, 'days').format('YYYY-MM-DD')};
      const result = isFuture(record);
      expect(result).to.be.true;
    });
    it('should return false when the date is before today', () => {
      const record = { nextDueDate: moment().subtract(10, 'days').format('YYYY-MM-DD')};
      const result = isFuture(record);
      expect(result).to.be.false;
    });
    it('should return true when the date is today', () => {
      const record = { nextDueDate: moment().format('YYYY-MM-DD')};
      const result = isFuture(record);
      expect(result).to.be.true;
    });
  });
  /* describe.only('mergeItems', () => {
    let data, expectedData;
    beforeEach(() => {
      data = [{
        title: 'wages',
        transactions: [
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      },{
        title: 'wages',
        transactions: [
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      },{
        title: 'child benefit',
        transactions: [
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      },{
        title: 'child benefit',
        transactions: [
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      },{
        title: 'child benefit',
        transactions: [
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      },{
        title: 'child benefit',
        transactions: [
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      }];
      expectedData = [{
        title: 'wages',
        transactions: [
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      }, {
        title: 'child benefit',
        transactions: [
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "90gvsd55J5JUPAPsC5t1", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "9cF1uJqSSgNdylBuQkmF", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-01-31", title: "wages"},
          {id: "B78Le0h94fB4Z4Z8aMh7", amount: "564665", frequency: "Monthly", nextDueDate: "2018-02-28", title: "wages"},
        ]
      }]
    });
    it('should merge items with the same keys', () => {
      const result = mergeItems(data);
      expect(result).to.eql(expectedData);
    });
  })*/
});
