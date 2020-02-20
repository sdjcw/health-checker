const assert = require('assert').strict;
const request = require('request-promise');

const lcDashboard = require('./lc-dashboard');

const router = require('express').Router();
router.get('/engine-request-stat', (req, res) => {
  res.send('Got it!');
});

const requestWebService = async () => {
  const {
    LEANCLOUD_APP_DOMAIN: appDomain,
    LEANCLOUD_REGION: region,
  } = process.env;
  await request({
    // TODO 文档有坑: region 不是大写
    url: `https://${appDomain}.${region == 'us' ? 'avosapps.us' : 'leanapp.cn'}/engine-request-stat`
  });
};

const expectQps = 0.5;
setInterval(() => {
  requestWebService();
}, 1000 / 0.5);

const check = async (lastCheckTime) => {
  const now = new Date();
  const stats = await lcDashboard.getEngineRequestStat;(lastCheckTime, now);
  const stat = stats.find(s => s.tag.status == '200');
  const dps = stat.dps.entries();

  assert.ok(dps.length > (now - lastCheckTime) / (1000 * 60 * 2));
  dps.forEach(d => assert.ok(d[1] >= expectQps ));
};

module.exports = {
  name: 'engine_request_stat',
  interval: 1000 * 60 * 5,
  check,
  router,
};
