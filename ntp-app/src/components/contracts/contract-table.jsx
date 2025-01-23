import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Eye, Pencil } from "lucide-react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

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

export const ContractTable = ({ 
  contracts = [], 
  onView,
  onEdit
}) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Mã HĐ</TableHead>
          <TableHead>Khách hàng</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Trạng thái</TableHead>
          <TableHead>Ngày bắt đầu</TableHead>
          <TableHead>Tổng tiền</TableHead>
          <TableHead>Đã thanh toán</TableHead>
          <TableHead className="text-right">Thao tác</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {contracts.map((contract) => (
          <TableRow key={contract.id}>
            <TableCell className="font-medium">{contract.code}</TableCell>
            <TableCell>{contract.customer_name}</TableCell>
            <TableCell>{typeLabels[contract.type]}</TableCell>
            <TableCell>
              <Badge className={statusColors[contract.status]}>
                {contract.status === 'pending' && 'Chờ xử lý'}
                {contract.status === 'active' && 'Đang thực hiện'}
                {contract.status === 'completed' && 'Hoàn thành'}
                {contract.status === 'cancelled' && 'Đã hủy'}
              </Badge>
            </TableCell>
            <TableCell>
              {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: vi })}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(contract.total_amount)}
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(contract.paid_amount)}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onView(contract)}
                >
                  <Eye className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => onEdit(contract)}
                >
                  <Pencil className="h-4 w-4" />
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 