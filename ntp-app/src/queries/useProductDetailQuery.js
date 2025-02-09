import {URLs} from "@/helpers/url";
import request from "@/helpers/request";
import {QUERY_KEY} from "@/helpers/constants";
import {useQuery} from "@tanstack/react-query";

const useProductDetailQuery = (id) =>
  useQuery({
    queryKey: [QUERY_KEY.PRODUCT_DETAIL, id],
    queryFn: () => request(URLs.PRODUCTS.DETAIL(id))
  });

export default useProductDetailQuery; 