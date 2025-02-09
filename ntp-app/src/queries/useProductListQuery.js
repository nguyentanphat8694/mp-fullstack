import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const useProductListQuery = (params) =>
  useQuery({
    queryKey: [QUERY_KEY.PRODUCT_LIST, params],
    queryFn: () =>
      request(URLs.PRODUCTS.LIST, {
        config: {
          params: {...params}
        }
      }),
  });

export default useProductListQuery; 