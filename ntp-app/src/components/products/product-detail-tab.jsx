import {Card, CardContent} from '@/components/ui/card.jsx';
import {Badge} from '@/components/ui/badge.jsx';
import {cn} from '@/lib/utils.js';
import {CircleDollarSign, Clock, Info, ShoppingBag, Tag} from 'lucide-react';
import {Separator} from '@/components/ui/separator.jsx';
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import PropTypes from 'prop-types';

export const ProductDetailTab = ({productId, product}) => {
  return <div className="grid md:grid-cols-3 gap-6">
    <Card className="md:col-span-2">
      <CardContent className="p-0">
        <div className="relative aspect-[16/9]">
          <img
              src={product.image}
              alt={product.name}
              className="w-full h-full object-cover rounded-t-lg"
          />
          <Badge
              className={cn(
                  'absolute top-4 right-4',
                  product.status === 'available' ? 'bg-green-500' :
                      product.status === 'rented' ? 'bg-blue-500' :
                          'bg-yellow-500',
              )}
          >
            {product.status === 'available' && 'Có sẵn'}
            {product.status === 'rented' && 'Đang cho thuê'}
            {product.status === 'maintenance' && 'Đang bảo trì'}
          </Badge>
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
          <p className="font-medium">
            {product.category === 'wedding_dress' && 'Váy cưới'}
            {product.category === 'vest' && 'Vest'}
            {product.category === 'accessories' && 'Phụ kiện'}
            {product.category === 'ao_dai' && 'Áo dài'}
          </p>
        </div>

        <Separator/>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <CircleDollarSign className="h-4 w-4"/>
            <span>Giá cho thuê</span>
          </div>
          <p className="font-medium">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND',
            }).format(product.price)}
          </p>
        </div>

        <Separator/>

        <div className="space-y-2">
          <div className="flex items-center gap-2 text-muted-foreground">
            <Clock className="h-4 w-4"/>
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

          <ul className="mt-4 space-y-2">
            <li>Chất liệu: Lụa cao cấp, ren Pháp</li>
            <li>Màu sắc: Trắng tinh khôi</li>
            <li>Kích thước: S / M / L</li>
            <li>Phụ kiện đi kèm: Khăn voan, găng tay</li>
            <li>Thời gian cho thuê: 3-5 ngày</li>
            <li>Đặt cọc: 50% giá trị sản phẩm</li>
          </ul>

          <div className="mt-4">
            <h4 className="font-medium mb-2">Chính sách cho thuê:</h4>
            <ul className="space-y-2">
              <li>Đặt lịch trước ít nhất 1 tuần</li>
              <li>Miễn phí chỉnh sửa theo số đo</li>
              <li>Bảo quản theo hướng dẫn của nhân viên</li>
              <li>Hoàn trả đúng thời hạn đã thỏa thuận</li>
            </ul>
          </div>
        </div>
      </CardContent>
    </Card>

    <Card className="md:col-span-3">
      <CardContent className="p-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Số lần cho thuê</p>
            <p className="text-2xl font-bold">24</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Đánh giá trung bình</p>
            <p className="text-2xl font-bold">4.8/5</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Tỷ lệ đặt lại</p>
            <p className="text-2xl font-bold">92%</p>
          </div>
          <div className="space-y-2">
            <p className="text-muted-foreground text-sm">Doanh thu</p>
            <p className="text-2xl font-bold">120tr</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>;
};

ProductDetailTab.propTypes = {
  product: PropTypes.object,
  productId: PropTypes.string
}