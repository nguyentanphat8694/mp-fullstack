import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const typeLabels = {
  income: "Thu",
  expense: "Chi"
}

const typeColors = {
  income: "bg-green-500",
  expense: "bg-red-500"
}

export const TransactionTable = ({ transactions = [] }) => {
  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Ngày</TableHead>
          <TableHead>Loại</TableHead>
          <TableHead>Số tiền</TableHead>
          <TableHead>Mô tả</TableHead>
          <TableHead>Hợp đồng</TableHead>
          <TableHead>Người tạo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id}>
            <TableCell>
              {format(new Date(transaction.created_at), 'dd/MM/yyyy', { locale: vi })}
            </TableCell>
            <TableCell>
              <Badge className={typeColors[transaction.type]}>
                {typeLabels[transaction.type]}
              </Badge>
            </TableCell>
            <TableCell>
              {new Intl.NumberFormat('vi-VN', {
                style: 'currency',
                currency: 'VND'
              }).format(transaction.amount)}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              {transaction.contract_code || '-'}
            </TableCell>
            <TableCell>{transaction.created_by_name}</TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
} 