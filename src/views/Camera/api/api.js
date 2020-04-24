import {constructRequest} from '@/api.js';

function getCamera(cameraId, page) {
  var request = constructRequest(`/cameras/${cameraId}`, 'get');
  console.log('PAGE is ' + page)
  request.params = {page: page}
  return axios(request);
}

function addImages(imageList, cameraId) {
  var request = constructRequest(`/cameras/${cameraId}/images`, 'post');
  request.data = imageList
  debugger;
  return axios(request)
}

function deleteCamera(cameraId) {
  var request = constructRequest(`/cameras/${cameraId}`, 'delete');
  return axios(request)
}

export {getCamera, addImages, deleteCamera};
