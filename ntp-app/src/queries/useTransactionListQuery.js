import { useQuery } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

/**
 * Hook to fetch transaction list
 * @param {Object} params Query parameters
 * @param {string} params.type Transaction type (income/expense)
 * @param {number} params.month Month number (1-12)
 * @param {number} params.year Year number
 * @param {number} params.limit Items per page
 * @param {number} params.offset Offset for pagination
 * @param {Object} options Query options
 * @returns {UseQueryResult} Query result object
 */
const useTransactionListQuery = (params = {}, options = {}) => {
  const { type, month, year, limit, offset } = params;

  return useQuery({
    queryKey: [QUERY_KEY.FINANCE_LIST, type, month, year, limit, offset],
    queryFn: () => request(URLs.FINANCE.LIST, {
      params: {
        ...(type && type !== 'all' && { type }),
        ...(month && { month }),
        ...(year && { year }),
        ...(limit && { limit }),
        ...(offset && { offset })
      }
    }),
    keepPreviousData: true, // Keep old data while fetching new data
    ...options
  });
};

export default useTransactionListQuery; 