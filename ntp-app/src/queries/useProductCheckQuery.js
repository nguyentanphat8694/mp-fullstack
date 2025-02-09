import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const useProductCheckQuery = (id, params) =>
  useQuery({
    queryKey: [QUERY_KEY.PRODUCT_CHECK, id, params],
    queryFn: () =>
      request(URLs.PRODUCTS.CHECK(id), {
        config: {
          params: {...params}
        }
      }),
  });

export default useProductCheckQuery; 