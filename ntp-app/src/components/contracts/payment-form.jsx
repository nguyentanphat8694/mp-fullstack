import { useState, useEffect } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { DatePicker } from "@/components/ui/date-picker"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const paymentMethods = [
  { value: "cash", label: "Tiền mặt" },
  { value: "bank_transfer", label: "Chuyển khoản" },
  { value: "card", label: "Thẻ" },
]

export const PaymentForm = ({ 
  contractId,
  totalAmount = 0,
  readOnly = false 
}) => {
  const [payments, setPayments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [newPayment, setNewPayment] = useState({
    amount: "",
    method: "cash",
    date: new Date(),
  })

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await fetch(`/api/contracts/${contractId}/payments`)
        const data = await response.json()
        setPayments(data)
      } catch (error) {
        console.error('Error fetching payments:', error)
      } finally {
        setIsLoading(false)
      }
    }

    if (contractId) {
      fetchPayments()
    }
  }, [contractId])

  const handleAddPayment = async () => {
    try {
      const response = await fetch(`/api/contracts/${contractId}/payments`, {
        method: 'POST',
        body: JSON.stringify(newPayment)
      })
      const data = await response.json()
      setPayments([...payments, data])
      setNewPayment({
        amount: "",
        method: "cash",
        date: new Date(),
      })
    } catch (error) {
      console.error('Error adding payment:', error)
    }
  }

  const totalPaid = payments.reduce((sum, payment) => sum + payment.amount, 0)
  const remaining = totalAmount - totalPaid

  return (
    <div className="space-y-6">
      <div className="grid gap-4 md:grid-cols-3">
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Tổng tiền</p>
          <p className="text-2xl font-bold">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(totalAmount)}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Đã thanh toán</p>
          <p className="text-2xl font-bold text-green-600">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(totalPaid)}
          </p>
        </div>
        <div className="p-4 border rounded-lg">
          <p className="text-sm text-muted-foreground">Còn lại</p>
          <p className="text-2xl font-bold text-red-600">
            {new Intl.NumberFormat('vi-VN', {
              style: 'currency',
              currency: 'VND'
            }).format(remaining)}
          </p>
        </div>
      </div>

      {!readOnly && (
        <div className="grid gap-4 md:grid-cols-4 items-end">
          <div>
            <Input
              type="number"
              placeholder="Số tiền"
              value={newPayment.amount}
              onChange={(e) => setNewPayment({
                ...newPayment,
                amount: Number(e.target.value)
              })}
            />
          </div>
          <div>
            <Select
              value={newPayment.method}
              onValueChange={(value) => setNewPayment({
                ...newPayment,
                method: value
              })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Phương thức" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((method) => (
                  <SelectItem key={method.value} value={method.value}>
                    {method.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <DatePicker
              value={newPayment.date}
              onChange={(date) => setNewPayment({
                ...newPayment,
                date
              })}
            />
          </div>
          <Button
            onClick={handleAddPayment}
            disabled={!newPayment.amount || !newPayment.method}
          >
            <Plus className="h-4 w-4 mr-2" />
            Thêm
          </Button>
        </div>
      )}

      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Ngày</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Phương thức</TableHead>
            <TableHead>Người thu</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {payments.map((payment) => (
            <TableRow key={payment.id}>
              <TableCell>
                {format(new Date(payment.date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(payment.amount)}
              </TableCell>
              <TableCell>
                {paymentMethods.find(m => m.value === payment.method)?.label}
              </TableCell>
              <TableCell>{payment.created_by_name}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  )
} 