import { useMutation, useQueryClient } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useAppointmentAssignMutate = (appointmentId, callbackFn) => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (isAssign) =>
      request(URLs.APPOINTMENTS.ASSIGN(appointmentId), {
        verb: 'put',
        params: {
          type: isAssign
        }
      }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.APPOINTMENT_LIST] });
      callbackFn && callbackFn();
    },
  });
};

export default useAppointmentAssignMutate; 