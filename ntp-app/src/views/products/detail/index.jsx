import {useState, useEffect} from 'react';
import {useParams} from 'react-router-dom';
import {Tabs, TabsContent, TabsList, TabsTrigger} from '@/components/ui/tabs';
import {Button} from '@/components/ui/button';
import {Calendar} from 'lucide-react';
import {CheckAvailableModal} from '@/components/products/check-available-modal';
import {ProductDetailTab} from '@/components/products/product-detail-tab.jsx';
import {ProductHistoryTab} from '@/components/products/product-history-tab.jsx';

const ProductDetailPage = () => {
  const {id} = useParams();
  const [product, setProduct] = useState(null);
  const [rentalHistory, setRentalHistory] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showCheckModal, setShowCheckModal] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock product data
        const mockProduct = {
          id: parseInt(id),
          code: 'WD001',
          name: 'Váy cưới công chúa',
          category: 'wedding_dress',
          status: 'available',
          description: 'Váy cưới phong cách công chúa, màu trắng tinh khôi',
          image: '/images/products/wd001.jpg',
          price: 5000000,
          created_at: '2024-01-01',
        };

        // Mock rental history
        const mockHistory = [
          {
            id: 1,
            customer_name: 'Nguyễn Văn A',
            rental_start: '2024-02-15',
            rental_end: '2024-02-17',
            status: 'completed',
            price: 5000000,
            note: 'Khách hài lòng với sản phẩm',
          },
          {
            id: 2,
            customer_name: 'Trần Thị B',
            rental_start: '2024-03-01',
            rental_end: '2024-03-03',
            status: 'cancelled',
            price: 5000000,
            note: 'Khách hủy vì có việc đột xuất',
          },
        ];

        setProduct(mockProduct);
        setRentalHistory(mockHistory);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, [id]);

  if (isLoading) return <div>Loading...</div>;
  if (!product) return <div>Không tìm thấy sản phẩm</div>;

  return (
      <div className="space-y-6">
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold">{product.name}</h1>
            <p className="text-muted-foreground">Mã sản phẩm: {product.code}</p>
          </div>
          <Button onClick={() => setShowCheckModal(true)}>
            <Calendar className="mr-2 h-4 w-4"/>
            Kiểm tra tình trạng
          </Button>
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
                rentalHistory={rentalHistory}
            />
          </TabsContent>
        </Tabs>

        <CheckAvailableModal
            isOpen={showCheckModal}
            onClose={() => setShowCheckModal(false)}
            productId={product.id}
            productName={product.name}
        />
      </div>
  );
};

export default ProductDetailPage;