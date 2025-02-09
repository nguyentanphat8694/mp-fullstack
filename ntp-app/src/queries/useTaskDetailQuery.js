import {useQuery} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useTaskDetailQuery = (id) => {
  return useQuery({
    queryKey: [QUERY_KEY.TASK_DETAIL, id],
    queryFn: () => request(URLs.TASKS.DETAIL(id)),
  });
};

export default useTaskDetailQuery; 