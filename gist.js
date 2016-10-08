'use strict';

const FILENAME = 'location.json';
const ERR_NOT_FOUND = 'Not Found';
const USER_AGENT = 'meeDamian';

let me = {
  FILENAME,
  ERR_NOT_FOUND,
  USER_AGENT
};

me.download = function({request}, gist) {
  return new Promise((resolve, reject) => {
    request.get({url: `https://api.github.com/gists/${gist}`, json:true, headers: {
      'User-Agent': USER_AGENT
    }}, (err, res, json) => {
      if (err || res.statusCode !== 200) {
        reject(err);
        return;
      }

      resolve({json, gist});
    });
  });
};

me.process = function({u}, {gist, json: {message, updated_at: at, files}}) {
  if (message && message === ERR_NOT_FOUND) {
    throw new Error(`gist ${ERR_NOT_FOUND}`);
  }

  const locationFile = files[FILENAME];
  if (!locationFile) {
    throw new Error(`required file ${FILENAME} is missing`);
  }

  return Object.assign(JSON.parse(locationFile.content), {at, gist});
};

me = require('mee')(module, me, {
  request: require('request'),
  u: require('./u.js')
});