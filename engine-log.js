const assert = require('assert').strict;
const lcDashboard = require('./lc-dashboard');

const testLogContent = '这是测试云引擎日志功能的测试日志。';
const testLogPrintInterval = 30000;

setInterval(() => {
  console.log(testLogContent, new Date().toISOString());
}, testLogPrintInterval);

const check = async (lastCheckTime) => {
  const now = new Date();
  const response = await lcDashboard.getEngineLogs(lastCheckTime);
  const logs = response.filter(log => log.content.includes(testLogContent));
  const expectLogCount = Math.floor((now - lastCheckTime) / testLogPrintInterval);
  
  console.log(`Engine log check: expect log count: ${expectLogCount}, actual: ${logs.length}`);
  assert.ok(expectLogCount <= logs.length);
};

module.exports = {
  name: 'engine_log_count',
  interval: 1000 * 60 * 2,
  check,
};

