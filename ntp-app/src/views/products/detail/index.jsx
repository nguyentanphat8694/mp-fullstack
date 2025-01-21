import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CheckAvailableModal } from "@/components/products/check-available-modal"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { 
  CircleDollarSign, 
  Tag, 
  Info, 
  Clock,
  ShoppingBag
} from "lucide-react"
import { cn } from "@/lib/utils"

const ProductDetailPage = () => {
  const { id } = useParams()
  const [product, setProduct] = useState(null)
  const [rentalHistory, setRentalHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [showCheckModal, setShowCheckModal] = useState(false)
  
  // Filter states for rental history
  const [yearFilter, setYearFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("all")

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock product data
        const mockProduct = {
          id: parseInt(id),
          code: "WD001",
          name: "Váy cưới công chúa",
          category: "wedding_dress",
          status: "available",
          description: "Váy cưới phong cách công chúa, màu trắng tinh khôi",
          image: "/images/products/wd001.jpg",
          price: 5000000,
          created_at: "2024-01-01"
        }

        // Mock rental history
        const mockHistory = [
          {
            id: 1,
            customer_name: "Nguyễn Văn A",
            rental_start: "2024-02-15",
            rental_end: "2024-02-17",
            status: "completed",
            price: 5000000,
            note: "Khách hài lòng với sản phẩm"
          },
          {
            id: 2,
            customer_name: "Trần Thị B",
            rental_start: "2024-03-01",
            rental_end: "2024-03-03",
            status: "cancelled",
            price: 5000000,
            note: "Khách hủy vì có việc đột xuất"
          }
        ]

        setProduct(mockProduct)
        setRentalHistory(mockHistory)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  if (isLoading) return <div>Loading...</div>
  if (!product) return <div>Không tìm thấy sản phẩm</div>

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{product.name}</h1>
          <p className="text-muted-foreground">Mã sản phẩm: {product.code}</p>
        </div>
        <Button onClick={() => setShowCheckModal(true)}>
          <Calendar className="mr-2 h-4 w-4" />
          Kiểm tra tình trạng
        </Button>
      </div>

      <Tabs defaultValue="details">
        <TabsList>
          <TabsTrigger value="details">Chi tiết sản phẩm</TabsTrigger>
          <TabsTrigger value="history">Lịch sử cho thuê</TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="space-y-6">
          <div className="grid md:grid-cols-3 gap-6">
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
                      "absolute top-4 right-4",
                      product.status === 'available' ? 'bg-green-500' :
                      product.status === 'rented' ? 'bg-blue-500' :
                      'bg-yellow-500'
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
                    <Tag className="h-4 w-4" />
                    <span>Mã sản phẩm</span>
                  </div>
                  <p className="font-medium">{product.code}</p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <ShoppingBag className="h-4 w-4" />
                    <span>Danh mục</span>
                  </div>
                  <p className="font-medium">
                    {product.category === 'wedding_dress' && 'Váy cưới'}
                    {product.category === 'vest' && 'Vest'}
                    {product.category === 'accessories' && 'Phụ kiện'}
                    {product.category === 'ao_dai' && 'Áo dài'}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <CircleDollarSign className="h-4 w-4" />
                    <span>Giá cho thuê</span>
                  </div>
                  <p className="font-medium">
                    {new Intl.NumberFormat('vi-VN', {
                      style: 'currency',
                      currency: 'VND'
                    }).format(product.price)}
                  </p>
                </div>

                <Separator />

                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-muted-foreground">
                    <Clock className="h-4 w-4" />
                    <span>Ngày tạo</span>
                  </div>
                  <p className="font-medium">
                    {format(new Date(product.created_at), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
              </CardContent>
            </Card>

            <Card className="md:col-span-3">
              <CardContent className="space-y-4 p-6">
                <div className="flex items-center gap-2 text-muted-foreground">
                  <Info className="h-4 w-4" />
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
          </div>
        </TabsContent>

        <TabsContent value="history">
          <div className="space-y-6">
            <div className="flex gap-4">
              <Select value={yearFilter} onValueChange={setYearFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo năm" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả các năm</SelectItem>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2023">2023</SelectItem>
                </SelectContent>
              </Select>

              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-[180px]">
                  <SelectValue placeholder="Lọc theo trạng thái" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">Tất cả trạng thái</SelectItem>
                  <SelectItem value="completed">Đã hoàn thành</SelectItem>
                  <SelectItem value="cancelled">Đã hủy</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-4">
              {rentalHistory
                .filter(item => 
                  (yearFilter === "all" || new Date(item.rental_start).getFullYear().toString() === yearFilter) &&
                  (statusFilter === "all" || item.status === statusFilter)
                )
                .map((item) => (
                  <div 
                    key={item.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="font-medium">{item.customer_name}</p>
                        <p className="text-sm text-muted-foreground">
                          {format(new Date(item.rental_start), 'dd/MM/yyyy')} - {format(new Date(item.rental_end), 'dd/MM/yyyy')}
                        </p>
                      </div>
                      <Badge className={
                        item.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
                      }>
                        {item.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
                      </Badge>
                    </div>
                    {item.note && (
                      <p className="text-sm text-muted-foreground">{item.note}</p>
                    )}
                  </div>
                ))}
            </div>
          </div>
        </TabsContent>
      </Tabs>

      <CheckAvailableModal
        isOpen={showCheckModal}
        onClose={() => setShowCheckModal(false)}
        productId={product.id}
        productName={product.name}
      />
    </div>
  )
}

export default ProductDetailPage 