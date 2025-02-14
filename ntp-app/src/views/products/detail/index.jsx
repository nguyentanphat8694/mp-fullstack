import {useState, useCallback} from 'react';
import {useParams} from 'react-router-dom';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import {Calendar} from 'lucide-react';
import {CheckAvailableModal} from '@/components/products/check-available-modal';
import {ProductDetailTab} from '@/components/products/product-detail-tab.jsx';
import {ProductHistoryTab} from '@/components/products/product-history-tab.jsx';
import useProductDetailQuery from "@/queries/useProductDetailQuery.js";

const ProductDetailPage = () => {
  const {id} = useParams();
  const [rentalHistory, setRentalHistory] = useState([]);
  const [showCheckModal, setShowCheckModal] = useState(false);

  const onCheckClick = useCallback(() => setShowCheckModal(true), []);

  const {data: productData, isPending} = useProductDetailQuery(id);
  const product = productData?.data?.data;
  console.log(productData)
  if (isPending) return <div>Loading...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
    <div className="space-y-6">
      <div className='flex justify-end items-center'>
        <Button onClick={onCheckClick}>
          <Calendar className="mr-2 h-4 w-4"/>
          Kiểm tra tình trạng
        </Button>
      </div>
      <div className="flex justify-center align-middle items-center">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">Mã sản phẩm: {product.code}</p>
        </div>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
          <TabsTrigger value="history">Lịch sử cho thuê</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <ProductDetailTab productId={id} product={product}/>
        </TabsContent>

        <TabsContent value="history">
          <ProductHistoryTab
            productId={id}
          />
        </TabsContent>
      </Tabs>

      <CheckAvailableModal
        showCheckModal={showCheckModal}
        setShowCheckModal={setShowCheckModal}
        productId={product.id}
        product={product}
        productName={product.name}
        isPending={isPending}
      />
    </div>
  );
};

export default ProductDetailPage;