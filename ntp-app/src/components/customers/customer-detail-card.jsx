import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Edit } from "lucide-react"

export const CustomerDetailCard = ({ customer, onEdit }) => {
  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <CardTitle>Thông tin khách hàng</CardTitle>
        <Button variant="ghost" size="icon" onClick={onEdit}>
          <Edit className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm text-muted-foreground">Họ tên</p>
            <p className="font-medium">{customer?.name}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Số điện thoại</p>
            <p className="font-medium">{customer?.phone}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nguồn</p>
            <p className="font-medium capitalize">{customer?.source}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Trạng thái</p>
            <p className="font-medium capitalize">{customer?.status}</p>
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Nhân viên phụ trách</p>
            <p className="font-medium">{customer?.assigned_to}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}