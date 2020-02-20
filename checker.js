const saveCheckResult = async ({checkItem, result, detail}) => {
  try {
    const AV = require('leanengine');
    await new AV.Object('CheckResult')
      .save({
        checkItem,
        result,
        detail,
      });
  } catch (err) {
    console.err(`Save check result err: save date: ${JSON.stringify(result, null, 2)}`, err);
  }
};

const checkItems = [
  require('./engine-log'),
  require('./engine-request-stat'),
];

checkItems.forEach(({name, interval, check}) => {
  let lastCheckTime = new Date(new Date() - interval);
  setInterval(async () => {
    console.log(name, 'check ...');
    const now = new Date();
    try {
      await check(lastCheckTime);
      await saveCheckResult({ checkItem: name, result: 'OK' });
    } catch (err) {
      await saveCheckResult({ checkItem: name, result: 'Failed', detail: err });
    }
    lastCheckTime = now;
  }, interval);
});

module.exports = {
  routers: checkItems.map(i => i.router).filter(r => r != null)
};
