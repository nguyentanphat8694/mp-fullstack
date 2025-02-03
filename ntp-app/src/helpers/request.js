import axios from "axios";
import includes from "lodash/includes";
import merge from "lodash/merge";

const instance = axios.create();

const request = (endpoint, { verb = "get", params = {}, config = {} } = {}) => {
  let promise;
  if (includes("get;delete;head", verb)) {
    promise = instance[verb](
      endpoint,
      merge(
        {
          headers: {
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        },
        config
      )
    );
  } else {
    promise = instance[verb](
      endpoint,
      params,
      merge(
        {
          headers: {
            Authorization:
              "Bearer " + window.localStorage.getItem("accessToken"),
          },
        },
        config
      )
    );
  }
  promise.catch((error) => {
    throw error;
  });
  return promise;
};

export default request;
