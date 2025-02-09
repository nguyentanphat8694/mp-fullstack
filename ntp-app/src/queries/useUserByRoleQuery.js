import {useQuery} from '@tanstack/react-query';
import {URLs} from '@/helpers/url';
import request from '@/helpers/request';
import {QUERY_KEY} from '@/helpers/constants';

const useUserByRoleQuery = (roles) => {
  return useQuery({
    queryKey: [QUERY_KEY.USER_BY_ROLE, roles],
    queryFn: () => 
      request(URLs.USERS.GET_BY_ROLE, {
        config: {
          params: {
            role: roles
          }
        }
      }),
  });
};

export default useUserByRoleQuery; 