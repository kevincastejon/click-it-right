import superagent from 'superagent';

export default async function (path, params = {}) {
  const url = `https://api.github.com/repos/click-it-right-community/community-shortcuts/contents/${path}`;
  return await superagent
    .get(url)
    .auth('d7d18bb70f2cf302fe85', 'd3158d51f0b1d0631854faef2948d7e8b81a4d08')
    .set('Accept', 'application/json')
    .set(params)
    .send();
}
