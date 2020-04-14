import {constructRequest} from '@/api.js';

function getBurst(burstId) {
  var request = constructRequest(`/bursts/${burstId}`, 'get');
  return axios(request);
}

function searchTargets(search) {
  var request = constructRequest('/targets', 'get');
  request.params = {search: search};
  return axios(request);
}

function getAllTargets(search) {
  var request = constructRequest('/targets/all', 'get');
  return axios(request);
}

function cleanLabel(label) {
  let validFields = [
    'x',
    'y',
    'x_frac',
    'y_frac',
    'x0',
    'y0',
    'x0_frac',
    'y0_frac',
    'width',
    'height',
    'width_frac',
    'height_frac',
    'target_id',
  ];
  var newLabel = {};
  validFields.forEach(field => {
    newLabel[field] = label[field];
  });
  return newLabel;
}

function createLabelAPI(image_id, label) {
  var newLabel = cleanLabel(label);
  var request = constructRequest('/images/' + image_id + '/labels', 'post');
  request.data = label;
  return axios(request);
}

function deleteLabel(label_id) {
  var request = constructRequest('/labels/' + label_id, 'delete');
  return axios(request);
}

function getLabels(image_id) {
  var request = constructRequest('/images/' + image_id + '/labels', 'get');
  return axios(request);
}

function updateLabel(label) {
  var request = constructRequest('/labels/' + label.id, 'put');
  request.data = label;
  return axios(request);
}

function uniqueTargets(listOfTargets) {
  var uniqueTargets = Array.from(new Set(listOfTargets.map(a => a.id))).map(
    id => {
      return listOfTargets.find(a => a.id === id);
    },
  );
  return uniqueTargets;
}

export {
  getBurst,
  searchTargets,
  getAllTargets,
  uniqueTargets,
  updateLabel,
  createLabelAPI,
  getLabels,
  deleteLabel,
};
