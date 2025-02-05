import axios from "axios";
import includes from "lodash/includes";
import merge from "lodash/merge";

const instance = axios.create();

const request = (endpoint, { verb = "get", params = {}, config = {} } = {}) => {
  let promise;
  const configs = window.localStorage.getItem('userInfo') ? merge(
    {
      headers: {
        Authorization:
          "Bearer " + JSON.parse(window.localStorage.getItem('userInfo')).token,
      },
    },
    config
  ) : config;
  if (includes("get;delete;head", verb)) {
    promise = instance[verb](
      endpoint,
      configs
    );
  } else {
    promise = instance[verb](
      endpoint,
      params,
      configs
    );
  }
  promise.catch((error) => {
    throw error;
  });
  return promise;
};

export default request;
