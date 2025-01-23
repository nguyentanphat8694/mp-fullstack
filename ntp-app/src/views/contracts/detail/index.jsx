import { useState } from "react"
import { useParams, useNavigate } from "react-router-dom"
import { ArrowLeft, Pencil, FileText, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContractForm } from "@/components/contracts/contract-form"
import { ContractNotes } from "@/components/contracts/contract-notes"
import { PaymentForm } from "@/components/contracts/payment-form"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import useUserInfoStore from "@/stores/useUserInfoStore"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
  } from "@/components/ui/table"

// Mock data for a single contract
const MOCK_CONTRACT = {
  id: 1,
  code: "HD001",
  type: "dress_rental",
  status: "active",
  customer: {
    id: 1,
    name: "Nguyễn Văn A",
    phone: "0901234567",
    email: "nguyenvana@gmail.com"
  },
  start_date: "2024-03-20",
  end_date: "2024-03-22",
  total_amount: 15000000,
  paid_amount: 5000000,
  created_by: {
    id: 1,
    name: "Sale 1"
  },
  created_at: "2024-03-15",
  products: [
    {
      product_id: 1,
      product: {
        id: 1,
        code: "VAY001",
        name: "Váy cưới cao cấp 2024",
        category: "Váy cưới"
      },
      rental_start: "2024-03-20",
      rental_end: "2024-03-22"
    },
    {
      product_id: 2,
      product: {
        id: 2,
        code: "VS001",
        name: "Vest nam đen",
        category: "Vest"
      },
      rental_start: "2024-03-20",
      rental_end: "2024-03-22"
    }
  ],
  photographer: {
    id: 1,
    name: "Photographer 1",
    phone: "0909123456"
  },
  notes: [
    {
      id: 1,
      content: "Khách yêu cầu thêm hoa cưới",
      status: "approved",
      created_by_name: "Sale 1",
      created_at: "2024-03-15T10:00:00Z"
    },
    {
      id: 2,
      content: "Cần điều chỉnh size váy",
      status: "pending",
      created_by_name: "Sale 2",
      created_at: "2024-03-16T14:30:00Z"
    }
  ],
  payments: [
    {
      id: 1,
      amount: 5000000,
      method: "cash",
      date: "2024-03-15",
      created_by_name: "Accountant 1"
    }
  ]
}

const statusColors = {
  pending: "bg-yellow-500",
  active: "bg-blue-500",
  completed: "bg-green-500",
  cancelled: "bg-red-500"
}

const typeLabels = {
  dress_rental: "Thuê váy cưới",
  wedding_photo: "Chụp ảnh cưới",
  pre_wedding_photo: "Chụp ảnh pre-wedding"
}

const ContractDetailPage = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { toast } = useToast()
  const userInfo = useUserInfoStore((state) => state.userInfo)
  
  const [contract, setContract] = useState(MOCK_CONTRACT) // Use mock data
  const [isLoading, setIsLoading] = useState(false) // Set to false since we're using mock data
  const [isEditing, setIsEditing] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Comment out API call
  /*
  useEffect(() => {
    const fetchContract = async () => {
      try {
        setIsLoading(true)
        const response = await fetch(`/api/contracts/${id}`)
        const data = await response.json()
        setContract(data)
      } catch (error) {
        console.error('Error fetching contract:', error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin hợp đồng",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchContract()
  }, [id])
  */

  const handleUpdate = async (data) => {
    try {
      setIsSubmitting(true)
      // Comment out API call
      /*
      const response = await fetch(`/api/contracts/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data)
      })
      const updatedContract = await response.json()
      */
      
      // Mock update
      setContract({
        ...contract,
        ...data
      })
      
      setIsEditing(false)
      toast({
        title: "Thành công",
        description: "Cập nhật hợp đồng thành công"
      })
    } catch (error) {
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật hợp đồng",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!contract) {
    return <div>Không tìm thấy hợp đồng</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button variant="ghost" onClick={() => navigate('/contracts')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Quay lại
          </Button>
          <div>
            <h1 className="text-2xl font-bold">
              Hợp đồng #{contract.code}
            </h1>
            <p className="text-muted-foreground">
              {typeLabels[contract.type]}
            </p>
          </div>
        </div>
        {!isEditing && userInfo?.role === 'admin' && (
          <Button onClick={() => setIsEditing(true)}>
            <Pencil className="h-4 w-4 mr-2" />
            Chỉnh sửa
          </Button>
        )}
      </div>

      {isEditing ? (
        <ContractForm
          defaultValues={contract}
          onSubmit={handleUpdate}
          isSubmitting={isSubmitting}
        />
      ) : (
        <>
          <div className="grid gap-6 md:grid-cols-3">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Thông tin chung</h2>
                </div>
                <Separator className="my-4" />
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Trạng thái</dt>
                    <dd>
                      <Badge className={statusColors[contract.status]}>
                        {contract.status === 'pending' && 'Chờ xử lý'}
                        {contract.status === 'active' && 'Đang thực hiện'}
                        {contract.status === 'completed' && 'Hoàn thành'}
                        {contract.status === 'cancelled' && 'Đã hủy'}
                      </Badge>
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Khách hàng</dt>
                    <dd className="font-medium">{contract.customer_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Số điện thoại</dt>
                    <dd>{contract.customer_phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Người tạo</dt>
                    <dd>{contract.created_by_name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Ngày tạo</dt>
                    <dd>
                      {format(new Date(contract.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Thời gian</h2>
                </div>
                <Separator className="my-4" />
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Ngày bắt đầu</dt>
                    <dd>
                      {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: vi })}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Ngày kết thúc</dt>
                    <dd>
                      {format(new Date(contract.end_date), 'dd/MM/yyyy', { locale: vi })}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-2">
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                  <h2 className="font-semibold">Thanh toán</h2>
                </div>
                <Separator className="my-4" />
                <dl className="space-y-2">
                  <div>
                    <dt className="text-sm text-muted-foreground">Tổng tiền</dt>
                    <dd className="text-xl font-bold">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(contract.total_amount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Đã thanh toán</dt>
                    <dd className="text-green-600 font-medium">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(contract.paid_amount)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Còn lại</dt>
                    <dd className="text-red-600 font-medium">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(contract.total_amount - contract.paid_amount)}
                    </dd>
                  </div>
                </dl>
              </CardContent>
            </Card>
          </div>

          <Tabs defaultValue="details">
            <TabsList>
              <TabsTrigger value="details">
                {contract.type === 'dress_rental' ? 'Sản phẩm' : 'Thợ chụp hình'}
              </TabsTrigger>
              <TabsTrigger value="payment">Thanh toán</TabsTrigger>
              <TabsTrigger value="notes">Ghi chú</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              {contract.type === 'dress_rental' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Sản phẩm</TableHead>
                      <TableHead>Ngày bắt đầu</TableHead>
                      <TableHead>Ngày kết thúc</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.products.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>
                          <div>
                            <p className="font-medium">{item.product.name}</p>
                            <p className="text-sm text-muted-foreground">
                              {item.product.code}
                            </p>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.rental_start), 'dd/MM/yyyy', { locale: vi })}
                        </TableCell>
                        <TableCell>
                          {format(new Date(item.rental_end), 'dd/MM/yyyy', { locale: vi })}
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="p-6 border rounded-lg">
                  <h3 className="font-medium">Thợ chụp hình</h3>
                  <div className="mt-2">
                    <p>{contract.photographer_name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contract.photographer_phone}
                    </p>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <PaymentForm
                contractId={contract.id}
                totalAmount={contract.total_amount}
                readOnly={userInfo?.role !== 'accountant'}
              />
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <ContractNotes
                contractId={contract.id}
                readOnly={!['admin', 'manager', 'accountant'].includes(userInfo?.role)}
              />
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default ContractDetailPage 