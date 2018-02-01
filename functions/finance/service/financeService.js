const moment = require('moment');

const INTERVALS = {
  Weekly: {
    num: 51,
    str: 'weeks'
  },
  Daily: {
    num: 364,
    str: 'days'
  },
  Monthly: {
    num: 11,
    str: 'months'
  }
};

const fetchFutureFinance = (record, period = 365) => {
  console.log('fetching future finance for', record, 'over period', period);
  if (record.frequency === 'Once' || record.frequency === 'Sporadic') return [record];
  return fetchFinance(fetchNextDue(record))
};
const fetchFinance = record => {
  console.log('calulating future incomes for', record);
  const results = [record];
  for(let i = 1; i <= INTERVALS[record.frequency].num; i++){
    const newRecord = Object.assign({}, record);
    newRecord.nextDueDate = getNextDue(record, i);
    results.push(newRecord);
  }
  console.log('fetch finance finished with results:', results);
  return results;
};
const getNextDue = (record, amount) => {
  console.log('incrementing', record, 'by', amount, 'intervals')
  return moment(record.nextDueDate).add(amount, INTERVALS[record.frequency].str).format('YYYY-MM-DD')
};
const fetchNextDue = record => {
  console.log('fetching next due record for', record);
  if (isFuture(record)) {
    console.log('record is in the future');
    return record
  }
  console.log('record is not in the future, testing next');
  const newRecord = Object.assign({}, record);
  newRecord.nextDueDate = getNextDue(record, 1);
  return fetchNextDue(newRecord);
};
const isFuture = record => {
  console.log('next due:', record.nextDueDate);
  return moment(record.nextDueDate).startOf('day').isSameOrAfter(moment().startOf('day'))
};
const mergeItems = items => {
  console.log('attempting to merge', items);
  const distinctItems = fetchFirstDistinct(items);
  const results = [];
  distinctItems.distinct.forEach(item => {
    const mergedItem = mergeRest(item, distinctItems.arr);
    console.log('merged item', mergedItem);
    results.push(mergedItem);
  });
  console.log('results', results);
  return results;
};
const fetchFirstDistinct = items => {
  console.log('attempting to fetch first distinct from', items);
  const distinctItems =[];
  const distinctKeys = [];
  let newOriginal = Object.assign([], items);
  items.forEach((item, index) => {
    if(distinctKeys.indexOf(item.title) !== -1) return;
    distinctKeys.push(item.title);
    distinctItems.push(item);
    newOriginal = newOriginal.splice(index, 1);
  });
  console.log('distinct items', distinctItems);
  return { distinct: distinctItems, arr: newOriginal };
};
const mergeRest = (item, items) => {
  console.log('attempting to find objects matching', item, 'in', items);
  const matchingItems = items.filter(nextItem => nextItem.title === item.title);
  console.log('matching items', matchingItems);
  matchingItems.forEach(nextItem => item.transactions = item.transactions.concat(nextItem.transactions));
  console.log('item is now', item);
  return item;
};
module.exports = {
  fetchFutureFinance,
  isFuture,
  mergeItems
};
