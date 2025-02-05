import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const fetchCustomerHistory = (id) => request(URLs.CUSTOMERS.HISTORY(id));

const useCustomerHistoryQuery = (id) =>
  useQuery({
    queryKey: [QUERY_KEY.CUSTOMER_HISTORY, id],
    queryFn: () => fetchCustomerHistory(id),
  });

export default useCustomerHistoryQuery;
