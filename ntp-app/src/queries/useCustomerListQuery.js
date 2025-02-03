import URLs from "@/helpers/urls";
import request from "@/helpers/request";
import { useMutate } from "@tanstack/react-query";
import { QUERY_KEY } from "@/helpers/constants";

const useColumnListMutate = (params, onSuccessFunc) =>
  useMutate({
    queryKey: [QUERY_KEY.CUSTOMER_LIST, params],
    queryFn: (params) =>
      request(URLs.CUSTOMERS.LIST, {
        verb: "post",
        params,
      }),
    onSuccess: onSuccessFunc,
  });

export default useColumnListMutate;
