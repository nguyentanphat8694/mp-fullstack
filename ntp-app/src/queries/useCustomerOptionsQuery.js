import { useQuery } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useCustomerOptionsQuery = (search) => {
  return useQuery({
    queryKey: [QUERY_KEY.CUSTOMER_OPTIONS, search],
    queryFn: () => request(URLs.CUSTOMERS.SELECT, {
      params: { search }
    }),
    enabled: !!search && search.length >= 2, // Only fetch when search has 2+ characters
    staleTime: 5 * 60 * 1000, // Cache for 5 minutes
  });
};

export default useCustomerOptionsQuery; 