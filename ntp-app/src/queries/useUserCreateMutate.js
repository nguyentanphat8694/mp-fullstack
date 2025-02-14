import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useUserCreateMutate = (callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (params) => request(URLs.USERS.CREATE, {
      verb: 'post',
      params
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.USER_LIST] });
      callbackFn && callbackFn();
    },
  });
};

export default useUserCreateMutate; 