import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useAppointmentCompleteMutate = (appointmentId, callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: () =>
      request(URLs.APPOINTMENTS.COMPLETE(appointmentId), {
        verb: 'put'
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.APPOINTMENT_LIST] });
      callbackFn && callbackFn();
    },
  });
};

export default useAppointmentCompleteMutate; 