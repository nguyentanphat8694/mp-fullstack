import {useMutation, useQueryClient} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useTaskUpdateMutate = (id, callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      request(URLs.TASKS.UPDATE(id), {
        verb: 'put',
        params: {
          title: data.title,
          description: data.description,
          assigned_to: data.assigned_to,
          due_date: data.due_date
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.TASK_LIST]});
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.TASK_DETAIL, id]});
      callbackFn && callbackFn();
    },
  });
};

export default useTaskUpdateMutate; 