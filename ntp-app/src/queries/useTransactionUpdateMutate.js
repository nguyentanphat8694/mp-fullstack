import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

/**
 * Hook to update transaction
 * @param {number} transactionId ID of transaction to update
 * @param {Function} callbackFn Callback function to execute after successful mutation
 * @returns {UseMutationResult} Mutation result object
 */
const useTransactionUpdateMutate = (transactionId, callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      const { type, amount, description } = data;

      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      // Validate required fields
      if (!type || !amount || !description) {
        throw new Error('Missing required fields');
      }

      return request(URLs.FINANCE.UPDATE(transactionId), {
        verb: 'put',
        params: {
          type,
          amount,
          description
        }
      });
    },
    onSuccess: () => {
      // Invalidate both list and detail queries
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FINANCE_LIST] });
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FINANCE_DETAIL, transactionId] });
      callbackFn && callbackFn();
    },
  });
};

export default useTransactionUpdateMutate; 