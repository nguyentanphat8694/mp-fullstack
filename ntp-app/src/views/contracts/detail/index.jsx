import { useState } from "react"
import { useParams, useNavigate, useSearchParams } from "react-router-dom"
import { Pencil, FileText, Calendar, DollarSign } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { ContractForm } from "@/components/contracts/contract-form"
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
import { PATHS } from "@/helpers/paths"
import useContractDetailQuery from "@/queries/useContractDetailQuery"
import { LoadingSpinner } from "@/components/loading-spinner"

// Mock data for contracts
const MOCK_CONTRACTS = {
  1: {
    id: 1,
    code: "HD001",
    customer_id: 1,
    customer: {
      id: 1,
      name: "Nguyễn Văn A",
      phone: "0901234567",
      email: "nguyenvana@gmail.com"
    },
    type: "dress_rental",
    status: "active",
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
        product_id: "1",
        product: {
          id: 1,
          code: "VAY001",
          name: "Váy cưới cao cấp 2024",
          category: "wedding_dress"
        },
        rental_start: "2024-03-20",
        rental_end: "2024-03-22"
      },
      {
        product_id: "2",
        product: {
          id: 2,
          code: "VS001", 
          name: "Vest nam đen",
          category: "vest"
        },
        rental_start: "2024-03-20",
        rental_end: "2024-03-22"
      }
    ],
    notes: [
      {
        id: 1,
        content: "Khách yêu cầu thêm hoa cưới",
        created_at: "2024-03-15T10:00:00Z",
        created_by: {
          id: 1,
          name: "Sale 1"
        }
      },
      {
        id: 2,
        content: "Cần điều chỉnh size váy",
        created_at: "2024-03-16T14:30:00Z",
        created_by: {
          id: 1,
          name: "Sale 1"
        }
      }
    ],
    payments: [
      {
        id: 1,
        amount: 5000000,
        payment_method: "cash",
        payment_date: "2024-03-15",
        created_by: {
          id: 2,
          name: "Accountant 1"
        },
        created_at: "2024-03-15T10:00:00Z"
      }
    ]
  },
  2: {
    id: 2,
    code: "HD002",
    customer_id: 2,
    customer: {
      id: 2,
      name: "Trần Thị B",
      phone: "0902345678",
      email: "tranthib@gmail.com"
    },
    type: "wedding_photo",
    status: "active",
    start_date: "2024-04-01",
    end_date: "2024-04-03",
    total_amount: 25000000,
    paid_amount: 10000000,
    created_by: {
      id: 1,
      name: "Sale 1"
    },
    created_at: "2024-03-20",
    photographer: {
      photographer_id: "1",
      photographer: {
        id: 1,
        name: "Nguyễn Văn Photographer",
        phone: "0909123456"
      },
      start_date: "2024-04-01",
      end_date: "2024-04-03"
    },
    notes: [
      {
        id: 1,
        content: "Khách muốn chụp ở phim trường ABC",
        created_at: "2024-03-20T10:00:00Z",
        created_by: {
          id: 1,
          name: "Sale 1"
        }
      },
      {
        id: 2,
        content: "Đã xác nhận lịch với phim trường",
        created_at: "2024-03-21T14:30:00Z",
        created_by: {
          id: 3,
          name: "Manager 1"
        }
      }
    ],
    payments: [
      {
        id: 1,
        amount: 10000000,
        payment_method: "bank_transfer",
        payment_date: "2024-03-20",
        created_by: {
          id: 2,
          name: "Accountant 1"
        },
        created_at: "2024-03-20T10:00:00Z"
      }
    ]
  }
};

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
  const [searchParams] = useSearchParams();
  
  const { data: contract, isLoading, error } = useContractDetailQuery(id);

  const [isEditing, setIsEditing] = useState(searchParams.get('edit') === 'true')
  const [isSubmitting, setIsSubmitting] = useState(false)

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    toast({
      title: "Lỗi",
      description: "Không thể tải thông tin hợp đồng",
      variant: "destructive"
    });
    return null;
  }

  if (!contract) {
    return <div>Không tìm thấy hợp đồng</div>;
  }

  const handleUpdate = async (data) => {
    try {
      setIsSubmitting(true)
      
      // Mock update
      setContract({
        ...contract,
        customer_id: data.customer_id,
        customer: {
          ...contract.customer,
          id: data.customer_id
        },
        type: data.type,
        start_date: data.start_date,
        end_date: data.end_date,
        total_amount: data.total_amount,
        products: data.products,
        photographer: data.photographer,
        notes: [
          ...contract.notes,
          ...(data.notes || []).map(note => ({
            id: Math.random(),
            content: note.content,
            created_at: note.created_at,
            created_by: {
              id: userInfo.id,
              name: userInfo.name
            }
          }))
        ],
        payments: [
          ...contract.payments,
          ...(data.payments || []).map(payment => ({
            id: Math.random(),
            amount: payment.amount,
            payment_method: payment.payment_method,
            payment_date: payment.payment_date,
            created_by: {
              id: userInfo.id,
              name: userInfo.name
            },
            created_at: new Date().toISOString()
          }))
        ]
      })
      
      setIsEditing(false)
      // Remove edit query param after successful update
      navigate(`${PATHS.CONTRACTS.DETAIL}/${id}`, { replace: true })
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

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex flex-col items-left gap-4">
            <h1 className="text-2xl font-bold">
              Hợp đồng #{contract.code}
            </h1>
            <p className="text-muted-foreground text-left">
              {typeLabels[contract.type]}
            </p>
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
          defaultValues={{
            customer_id: contract.customer_id,
            type: contract.type,
            start_date: new Date(contract.start_date),
            end_date: new Date(contract.end_date),
            total_amount: contract.total_amount,
            products: contract.products?.map(p => ({
              product_id: p.product_id,
              rental_start: new Date(p.rental_start),
              rental_end: new Date(p.rental_end)
            })),
            photographer: contract.photographer ? {
              photographer_id: contract.photographer.photographer_id,
              start_date: new Date(contract.photographer.start_date),
              end_date: new Date(contract.photographer.end_date)
            } : undefined,
            notes: [],
            payments: []
          }}
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
                    <dd className="font-medium">{contract.customer.name}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Số điện thoại</dt>
                    <dd>{contract.customer.phone}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Email</dt>
                    <dd>{contract.customer.email}</dd>
                  </div>
                  <div>
                    <dt className="text-sm text-muted-foreground">Người tạo</dt>
                    <dd>{contract.created_by.name}</dd>
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
                    <dt className="text-sm text-muted-foreground">Loại hợp đồng</dt>
                    <dd className="font-medium">{typeLabels[contract.type]}</dd>
                  </div>
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
                  {contract.type === 'dress_rental' ? (
                    <div>
                      <dt className="text-sm text-muted-foreground">Số sản phẩm</dt>
                      <dd>{contract.products?.length || 0} sản phẩm</dd>
                    </div>
                  ) : (
                    contract.photographer && (
                      <div>
                        <dt className="text-sm text-muted-foreground">Nhiếp ảnh</dt>
                        <dd>{contract.photographer.photographer.name}</dd>
                      </div>
                    )
                  )}
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
                {contract.type === 'dress_rental' ? 'Sản phẩm' : 'Nhiếp ảnh'}
              </TabsTrigger>
              <TabsTrigger value="notes">Ghi chú</TabsTrigger>
              <TabsTrigger value="payment">Thanh toán</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="mt-6">
              {contract.type === 'dress_rental' ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Mã SP</TableHead>
                      <TableHead>Tên sản phẩm</TableHead>
                      <TableHead>Ngày bắt đầu</TableHead>
                      <TableHead>Ngày kết thúc</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {contract.products?.map((item) => (
                      <TableRow key={item.product_id}>
                        <TableCell>{item.product.code}</TableCell>
                        <TableCell>{item.product.name}</TableCell>
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
              ) : contract.photographer && (
                <div className="p-6 border rounded-lg space-y-4">
                  <div>
                    <h3 className="font-medium">Thông tin nhiếp ảnh</h3>
                    <p>{contract.photographer.photographer.name}</p>
                    <p className="text-sm text-muted-foreground">
                      {contract.photographer.photographer.phone}
                    </p>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                      <p>{format(new Date(contract.photographer.start_date), 'dd/MM/yyyy', { locale: vi })}</p>
                    </div>
                    <div>
                      <p className="text-sm text-muted-foreground">Ngày kết thúc</p>
                      <p>{format(new Date(contract.photographer.end_date), 'dd/MM/yyyy', { locale: vi })}</p>
                    </div>
                  </div>
                </div>
              )}
            </TabsContent>

            <TabsContent value="notes" className="mt-6">
              <div className="space-y-4">
                {contract.notes?.map((note) => (
                  <div key={note.id} className="p-4 border rounded-lg">
                    <p>{note.content}</p>
                    <div className="mt-2 flex justify-between text-sm text-muted-foreground">
                      <span>Tạo bởi: {note.created_by.name}</span>
                      <span>{format(new Date(note.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}</span>
                    </div>
                  </div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="payment" className="mt-6">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Số tiền</TableHead>
                    <TableHead>Phương thức</TableHead>
                    <TableHead>Ngày thanh toán</TableHead>
                    <TableHead>Người tạo</TableHead>
                    <TableHead>Ngày tạo</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {contract.payments?.map((payment) => (
                    <TableRow key={payment.id}>
                      <TableCell>
                        {new Intl.NumberFormat('vi-VN').format(payment.amount)}đ
                      </TableCell>
                      <TableCell>
                        {payment.payment_method === 'cash' && 'Tiền mặt'}
                        {payment.payment_method === 'bank_transfer' && 'Chuyển khoản'}
                        {payment.payment_method === 'card' && 'Thẻ'}
                      </TableCell>
                      <TableCell>
                        {format(new Date(payment.payment_date), 'dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                      <TableCell>{payment.created_by.name}</TableCell>
                      <TableCell>
                        {format(new Date(payment.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TabsContent>
          </Tabs>
        </>
      )}
    </div>
  )
}

export default ContractDetailPage 