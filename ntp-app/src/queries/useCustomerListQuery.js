import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import { QUERY_KEY } from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const useCustomerListQuery = (params) =>
  useQuery({
    queryKey: [QUERY_KEY.CUSTOMER_LIST, params],
    queryFn: () =>
      request(URLs.CUSTOMERS.LIST, {
        config: {
          params: {...params}
        }
      }),
  });

export default useCustomerListQuery;
