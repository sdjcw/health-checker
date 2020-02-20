const request = require('request-promise');

const {
  LEANCLOUD_APP_ID: appId,
  LEANCLOUD_APP_MASTER_KEY: masterKey,
  LEANCLOUD_API_SERVER: apiServer,
  LEANCLOUD_APP_GROUP: groupName,
  LEANCLOUD_APP_ENV: prod,
} = process.env;

exports.getEngineLogs = async (since) => {
  return doRequest({
    url: `${apiServer}/1.1/tables/EngineLogs`,
    qs: {
      limit: 100,
      group: groupName,
      production: prod == 'production' ? 1 : 0,
      since,
    }
  });
};

exports.getEngineRequestStat = async (start, end) => {
  return doRequest({
    url: `${apiServer}/1.1/engine/stats/rpm`,
    qs: {
      start,
      end,
      groupName,
      status: '*'
    }
  });
};

const doRequest = async ({url, qs}) => {
  console.log(`request url: ${url}, qs: ${JSON.stringify(qs)}`);
  return await request.get({
    url,
    qs,
    headers: {
      'x-lc-id': appId,
      'x-lc-key': masterKey + ',master',
    },
    json: true,
  });
};
