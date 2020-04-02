import {constructRequest} from '@/api.js';

function getCamera(cameraId) {
  var request = constructRequest(`/cameras/${cameraId}`, 'get');
  return axios(request);
}

function addImages(imageList, cameraId) {
  var request = constructRequest(`/cameras/${cameraId}/images`, 'post');
  request.data = imageList
  return axios(request)
}

export {getCamera, addImages};
