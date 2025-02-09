import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

/**
 * Hook to create new transaction
 * @param {Function} callbackFn Callback function to execute after successful mutation
 * @returns {UseMutationResult} Mutation result object
 */
const useTransactionCreateMutate = (callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      const { type, amount, description } = data;

      // Validate required fields
      if (!type || !amount || !description) {
        throw new Error('Missing required fields');
      }

      return request(URLs.FINANCE.CREATE, {
        verb: 'post',
        params: {
          type,
          amount,
          description
        }
      });
    },
    onSuccess: () => {
      // Invalidate finance list query to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FINANCE_LIST] });
      callbackFn && callbackFn();
    },
  });
};

export default useTransactionCreateMutate; 