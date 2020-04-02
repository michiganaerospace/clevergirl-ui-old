import {constructRequest} from '@/api.js';

export default function(camera) {
  var request = constructRequest('/cameras', 'post')
  request.data = camera;
  return axios(request);
}
