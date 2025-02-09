import {useMutation, useQueryClient} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useTaskUpdateStatus = (taskId, callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (status) =>
      request(URLs.TASKS.UPDATE_STATUS(taskId), {
        verb: 'put',
        params: {
          status
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.TASK_DETAIL, taskId]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.TASK_LIST]});
      callbackFn && callbackFn();
    },
  });
};

export default useTaskUpdateStatus; 