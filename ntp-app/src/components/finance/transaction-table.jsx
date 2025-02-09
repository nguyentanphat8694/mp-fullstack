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
import PropTypes from "prop-types"
import { TransactionTableActions } from "./transaction-table-actions"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

const typeLabels = {
  income: "Thu",
  expense: "Chi"
}

const typeColors = {
  income: "bg-green-500",
  expense: "bg-red-500"
}

export const TransactionTable = ({ 
  transactions,
  currentPage,
  totalPages,
  onPageChange,
  onEdit,
  setSelectedTransaction,
  setShowDeleteDialog
}) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Loại</TableHead>
            <TableHead>Mô tả</TableHead>
            <TableHead>Số tiền</TableHead>
            <TableHead>Người tạo</TableHead>
            <TableHead>Ngày tạo</TableHead>
            <TableHead></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {transactions.map((transaction) => (
            <TableRow key={transaction.id}>
              <TableCell>
                <span className={transaction.type === 'income' ? 'text-green-600' : 'text-red-600'}>
                  {transaction.type === 'income' ? 'Thu' : 'Chi'}
                </span>
              </TableCell>
              <TableCell>{transaction.description}</TableCell>
              <TableCell>
                {new Intl.NumberFormat('vi-VN', {
                  style: 'currency',
                  currency: 'VND'
                }).format(transaction.amount)}
              </TableCell>
              <TableCell>{transaction.created_by.name}</TableCell>
              <TableCell>
                {format(new Date(transaction.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell>
                <TransactionTableActions
                  transaction={transaction}
                  onEdit={onEdit}
                  setSelectedTransaction={setSelectedTransaction}
                  setShowDeleteDialog={setShowDeleteDialog}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => onPageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                onClick={() => onPageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => onPageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  )
}

TransactionTable.propTypes = {
  transactions: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.oneOf(['income', 'expense']),
    amount: PropTypes.number,
    description: PropTypes.string,
    contract_id: PropTypes.number,
    created_at: PropTypes.string,
    created_by: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    })
  })),
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func,
  onEdit: PropTypes.func,
  setSelectedTransaction: PropTypes.func,
  setShowDeleteDialog: PropTypes.func
} 