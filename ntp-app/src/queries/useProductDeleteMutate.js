import {useMutation, useQueryClient} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useProductDeleteMutate = (callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id) =>
      request(URLs.PRODUCTS.DELETE(id), {
        verb: 'delete',
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.PRODUCT_LIST]});
      callbackFn && callbackFn();
    },
  });
};

export default useProductDeleteMutate; 