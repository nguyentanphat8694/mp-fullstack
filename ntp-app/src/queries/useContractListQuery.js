import { useQuery } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useContractListQuery = (params) => {
  return useQuery({
    queryKey: [QUERY_KEY.CONTRACT_LIST, params],
    queryFn: () => 
      request(URLs.CONTRACTS.LIST, {
        config: {
          params: {
            search: params?.search,
            type: params?.type,
            month: params?.month,
            year: params?.year,
            limit: params?.limit,
            offset: params?.offset
          }
        }
      }),
  });
};

export default useContractListQuery; 