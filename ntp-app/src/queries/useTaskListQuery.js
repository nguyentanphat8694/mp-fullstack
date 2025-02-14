import {useQuery} from "@tanstack/react-query";
import {QUERY_KEY} from "@/helpers/constants.js";
import request from "@/helpers/request.js";
import {URLs} from "@/helpers/url.js";

const useTaskListQuery = (params = {}, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY.TASK_LIST, params],
    queryFn: () => request(URLs.TASKS.LIST, {
      config: {
        params: params
      }
    }),
    ...options
  });
};

export default useTaskListQuery;