import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const useUserByRole = (role) =>
  useQuery({
    queryKey: [QUERY_KEY.USER_BY_ROLE, role],
    queryFn: () => request(URLs.USERS.GET_BY_ROLE(role)),
  });

export default useUserByRole;
