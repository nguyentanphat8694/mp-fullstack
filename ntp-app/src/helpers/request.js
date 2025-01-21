import axios from 'axios';
import includes from 'lodash/includes';

const instance = axios.create({
  withCredentials: true,
});

const request = (endpoint, { verb = 'get', params = {}, config = {} } = {}) => {
  let promise;
  if (includes('get;delete;head', verb)) {
    promise = instance[verb](endpoint, config);
  } else {
    promise = instance[verb](endpoint, params, config);
  }
  promise.catch((error) => {
    throw error;
  });
  return promise;
};

export default request;