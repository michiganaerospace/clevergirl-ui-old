import {APIPREFIX} from '@/api.js'


export default function(credentials, mode) {
  if (mode == 'Login') {
    // Must submit username/password as form data (OAuth2 standard).
    var formData = new FormData();
    formData.append('username', credentials.email);
    formData.append('password', credentials.password);
    var url = APIPREFIX + '/token';
    return axios.post(url, formData)
  } else {
    // Create a new user!
    var url = APIPREFIX + '/users';
    return axios({
      method: 'post',
      url: url,
      data: credentials,
    });
  }
}
