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

function uniqueTargets(listOfTargets) {
  var uniqueTargets = Array.from(new Set(listOfTargets.map(a => a.id)))
 .map(id => {
   return listOfTargets.find(a => a.id === id)
 })
  return uniqueTargets
}

export {getBurst, searchTargets, getAllTargets, uniqueTargets};
