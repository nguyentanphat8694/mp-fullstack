import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

/**
 * Hook to create new contract
 * @param {Function} callbackFn Callback function to execute after successful mutation
 * @returns {UseMutationResult} Mutation result object
 */
const useContractCreateMutate = (callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data) => {
      const { main, note, payment, product, photographer } = data;

      // Validate required fields in main object
      if (!main?.customer_id || !main?.type || !main?.start_date || !main?.end_date || !main?.total_amount) {
        throw new Error('Missing required fields in main contract data');
      }

      // Format request body
      const requestBody = {
        main: {
          customer_id: main.customer_id,
          type: main.type,
          start_date: main.start_date,
          end_date: main.end_date,
          total_amount: main.total_amount
        },
        // Only include optional objects if they have data
        ...(note?.note && { note: { note: note.note } }),
        ...(payment && {
          payment: {
            amount: payment.amount,
            payment_date: payment.payment_date,
            payment_method: payment.payment_method
          }
        }),
        ...(product && {
          product: {
            id: product.id,
            rental_start: product.rental_start,
            rental_end: product.rental_end
          }
        }),
        ...(photographer && {
          photographer: {
            id: photographer.id,
            start_date: photographer.start_date,
            end_date: photographer.end_date
          }
        })
      };

      return request(URLs.CONTRACTS.CREATE, {
        verb: 'post',
        params: requestBody
      });
    },
    onSuccess: () => {
      // Invalidate contract list query to refetch
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CONTRACT_LIST] });
      callbackFn && callbackFn();
    },
  });
};

export default useContractCreateMutate; 