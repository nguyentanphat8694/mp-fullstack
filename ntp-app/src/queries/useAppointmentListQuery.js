import { useQuery } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';
import { format } from "date-fns";

const useAppointmentListQuery = ({ searchTerm, date, status }) => {
  return useQuery({
    queryKey: [QUERY_KEY.APPOINTMENT_LIST, searchTerm, date, status],
    queryFn: () => request(URLs.APPOINTMENTS.LIST, {
      config: {
        params: {
          search: searchTerm,
          date: date ? format(new Date(date), 'yyyy-MM-dd') : undefined,
          status: status === 'all' ? undefined : status
        }
      }
    })
  });
};

export default useAppointmentListQuery; 