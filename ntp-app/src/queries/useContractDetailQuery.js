import { useQuery } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useContractDetailQuery = (id, options = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY.CONTRACT_DETAIL, id],
    queryFn: () => request(URLs.CONTRACTS.DETAIL(id)),
    enabled: !!id,
    ...options
  });
};

export default useContractDetailQuery; 