import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import PropTypes from "prop-types"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { ContractTableActions } from "./contract-table-actions"
import { TYPE_LABELS } from "@/helpers/constants.js"
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"

export const ContractTable = ({ 
  contracts, 
  currentPage,
  totalPages,
  onPageChange
}) => {
  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã HĐ</TableHead>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Loại HĐ</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>Tổng tiền</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {contracts.map((contract) => (
            <TableRow key={contract.id}>
              <TableCell className="font-medium">{contract.code}</TableCell>
              <TableCell>{contract.customer.name}</TableCell>
              <TableCell>{TYPE_LABELS[contract.type]}</TableCell>
              <TableCell>
                {format(new Date(contract.start_date), 'dd/MM/yyyy', { locale: vi })}
              </TableCell>
              <TableCell>
                {new Intl.NumberFormat('vi-VN').format(contract.total_amount)}đ
              </TableCell>
              <TableCell>
                <ContractTableActions contract={contract} />
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

ContractTable.propTypes = {
  contracts: PropTypes.arrayOf(PropTypes.shape({
    id: PropTypes.number,
    code: PropTypes.string,
    customer: PropTypes.shape({
      id: PropTypes.number,
      name: PropTypes.string
    }),
    type: PropTypes.string,
    start_date: PropTypes.string,
    total_amount: PropTypes.number
  })),
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func
} 