import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const fetchCustomerDetail = (id) => request(URLs.CUSTOMERS.DETAIL(id));

const useCustomerDetailQuery = (id) =>
  useQuery({
    queryKey: [QUERY_KEY.CUSTOMER_DETAIL, id],
    queryFn: () => fetchCustomerDetail(id),
  });

export default useCustomerDetailQuery;
