import {constructRequest} from '@/api.js';

function getBurst(burstId) {
  var request = constructRequest(`/bursts/${burstId}`, 'get');
  return axios(request);
}

function searchTargets(search) {
  var request = constructRequest('/targets', 'get');
  request.params = {'search': search}
  return axios(request);
}

function getAllTargets(search) {
  var request = constructRequest('/targets/all', 'get');
  return axios(request);
}

export {getBurst, searchTargets, getAllTargets};
