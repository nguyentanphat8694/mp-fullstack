import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const useProductHistoryQuery = (id, params) =>
  useQuery({
    queryKey: [QUERY_KEY.PRODUCT_HISTORY, id, params],
    queryFn: () =>
      request(URLs.PRODUCTS.HISTORY(id), {
        config: {
          params: {...params}
        }
      })
  });

export default useProductHistoryQuery; 