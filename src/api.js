const APIPREFIX = 'http://127.0.0.1:9000';

function verifyUser() {
  var token = localStorage.getItem('token');
  var request = {};
  var userIsVerified = false;
  request.method = 'get';
  request.headers = {Authorization: 'Bearer ' + token};
  request.url = APIPREFIX + '/users/me';
  return axios(request);
}

function constructRequest(url, method) {
  var request = {};
  var token = localStorage.getItem('token');
  request.url = APIPREFIX + url;
  request.method = method;
  request.headers = {Authorization: 'Bearer ' + token};
  return request;
}

export {APIPREFIX, constructRequest, verifyUser};
