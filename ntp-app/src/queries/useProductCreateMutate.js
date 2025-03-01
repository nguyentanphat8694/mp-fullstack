import {useMutation, useQueryClient} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useProductCreateMutate = (callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async (data) => {
      const formData = new FormData();
      Object.keys(data).forEach(key => {
        if (key === 'images' && Array.isArray(data[key])) {
          data[key].forEach(file => {
            formData.append('images[]', file);
          });
        } else {
          formData.append(key, data[key]);
        }
      });

      return request(URLs.PRODUCTS.CREATE, {
        verb: 'post',
        params: formData,
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        config: {
            maxContentLength: Infinity,
            maxBodyLength: Infinity
        },
      });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: [QUERY_KEY.PRODUCT_LIST]});
      callbackFn && callbackFn();
    },
  });
};

export default useProductCreateMutate; 