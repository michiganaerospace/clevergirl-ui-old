import {constructRequest} from '@/api.js';

function getCameras(organizationId) {
  var request = constructRequest(
    `/organizations/${organizationId}/cameras`,
    'get',
  );
  return axios(request);
}

export {getCameras}
