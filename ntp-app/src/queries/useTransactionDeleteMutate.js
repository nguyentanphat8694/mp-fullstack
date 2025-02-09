import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

/**
 * Hook to delete a transaction
 * @param {Function} callbackFn Callback function to execute after successful mutation
 * @returns {UseMutationResult} Mutation result object
 */
const useTransactionDeleteMutate = (callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (transactionId) => {
      if (!transactionId) {
        throw new Error('Transaction ID is required');
      }

      return request(URLs.FINANCE.DELETE(transactionId), {
        verb: 'delete'
      });
    },
    onSuccess: () => {
      // Invalidate finance list query to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.FINANCE_LIST] });
      callbackFn && callbackFn();
    },
  });
};

export default useTransactionDeleteMutate; 