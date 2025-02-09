import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import {format} from 'date-fns';
import {vi} from 'date-fns/locale';
import PropTypes from 'prop-types';
import {useState, useCallback} from 'react';
import useProductHistoryQuery from '@/queries/useProductHistoryQuery';

export const ProductHistoryTab = ({ productId, rentalHistory  }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const {data: historyData, isPending} = useProductHistoryQuery(productId, {
    limit: itemsPerPage,
    offset: (currentPage - 1) * itemsPerPage
  });

  // const rentalHistory = historyData?.data?.data ?? [];
  const totalItems = historyData?.data?.total ?? 0;
  const totalPages = Math.ceil(totalItems / itemsPerPage);

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page);
  }, []);

  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  return (
    <div className="space-y-6">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Khách hàng</TableHead>
            <TableHead>Ngày bắt đầu</TableHead>
            <TableHead>Ngày kết thúc</TableHead>
            <TableHead>Mã hợp đồng</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {rentalHistory.map((item) => (
          // {rentalHistory.map((item) => (
            <TableRow key={item.id}>
              <TableCell>{item.customer_name}</TableCell>
              <TableCell>
                {format(new Date(item.start_date), 'dd/MM/yyyy', {locale: vi})}
              </TableCell>
              <TableCell>
                {format(new Date(item.end_date), 'dd/MM/yyyy', {locale: vi})}
              </TableCell>
              <TableCell>{item.contract_id}</TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious 
              onClick={() => handlePageChange(Math.max(currentPage - 1, 1))}
              disabled={currentPage === 1}
            />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, index) => (
            <PaginationItem key={index + 1}>
              <PaginationLink
                onClick={() => handlePageChange(index + 1)}
                isActive={currentPage === index + 1}
              >
                {index + 1}
              </PaginationLink>
            </PaginationItem>
          ))}
          
          <PaginationItem>
            <PaginationNext
              onClick={() => handlePageChange(Math.min(currentPage + 1, totalPages))}
              disabled={currentPage === totalPages}
            />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>
  );
};

ProductHistoryTab.propTypes = {
  productId: PropTypes.string.isRequired
};