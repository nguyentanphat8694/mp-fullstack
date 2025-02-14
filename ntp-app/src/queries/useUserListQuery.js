import { useQuery } from '@tanstack/react-query';
import { URLs } from '@/helpers/url';
import request from '@/helpers/request';
import { QUERY_KEY } from '@/helpers/constants';

const useUserListQuery = ({ search, role, offset } = {}) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER_LIST, search, role, offset],
    queryFn: () => request(URLs.USERS.LIST, {
      config: {
        params: {
          search,
          role: role === 'all' ? undefined : role,
          offset
        }
      }
    })
  });
};

export default useUserListQuery; 