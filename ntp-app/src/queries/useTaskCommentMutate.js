import {useMutation, useQueryClient} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useTaskCommentMutate = (taskId, callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) =>
      request(URLs.TASKS.COMMENT(taskId), {
        verb: 'post',
        params: {
          id_user: data.id_user,
          comment: data.comment
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.TASK_DETAIL, taskId]});
      callbackFn && callbackFn();
    },
  });
};

export default useTaskCommentMutate; 