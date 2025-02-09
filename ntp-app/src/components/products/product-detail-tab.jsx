import {Card, CardContent} from '@/components/ui/card.jsx';
import {Info, ShoppingBag, Tag} from 'lucide-react';
import {Separator} from '@/components/ui/separator.jsx';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import PropTypes from 'prop-types';
import useProductDetailQuery from '@/queries/useProductDetailQuery';
import {PRODUCT_CATEGORY_OPTIONS} from '@/helpers/constants';

export const ProductDetailTab = ({productId, product}) => {
  const {data: productData, isPending} = useProductDetailQuery(productId);
  // const product = productData?.data;

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  if (!product) {
    return <div>Không tìm thấy thông tin sản phẩm</div>;
  }

  const categoryLabel = PRODUCT_CATEGORY_OPTIONS.find(
    cat => cat.value === product.category
  )?.label || product.category;

  return <div className="grid md:grid-cols-3 gap-6">
    <Card className="md:col-span-2">
      <CardContent className="p-0">
        <div className="relative aspect-[16/9]">
          <img
              src={product.images}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
          />
        </div>
      </CardContent>
    </Card>

    <Card>
      <CardContent className="space-y-4 p-6">
        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Tag className="h-4 w-4"/>
            <span>Mã sản phẩm</span>
          </div>
          <p className="font-medium">{product.code}</p>
        </div>

        <Separator/>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <ShoppingBag className="h-4 w-4"/>
            <span>Danh mục</span>
          </div>
          <p className="font-medium">{categoryLabel}</p>
        </div>

        <Separator/>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Info className="h-4 w-4"/>
            <span>Ngày tạo</span>
          </div>
          <p className="font-medium">
            {format(new Date(product.created_at), 'dd/MM/yyyy', {locale: vi})}
          </p>
        </div>
      </CardContent>
    </Card>

    <Card className="md:col-span-3">
      <CardContent className="space-y-4 p-6">
        <div className="flex items-center gap-2 text-muted-foreground">
          <Info className="h-4 w-4"/>
          <span>Mô tả chi tiết</span>
        </div>
        <div className="prose prose-sm max-w-none">
          <p>{product.description}</p>
        </div>
      </CardContent>
    </Card>
  </div>;
};

ProductDetailTab.propTypes = {
  productId: PropTypes.string.isRequired
}