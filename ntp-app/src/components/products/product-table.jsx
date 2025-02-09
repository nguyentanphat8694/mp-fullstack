import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {useState} from "react"
import {CheckAvailableModal} from "./check-available-modal"
import {ProductTableActions} from "@/components/products/product-table-actions.jsx";
import {DeleteProductConfirm} from "@/components/products/delete-product-confirm.jsx";
import PropTypes from "prop-types";
import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination"
import {PRODUCT_CATEGORY_OPTIONS} from "@/helpers/constants.js";

export const ProductTable = ({
  products = [],
  onEdit,
  currentPage,
  totalPages,
  onPageChange
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCheckModal, setShowCheckModal] = useState(false)

  return (
    <div className="space-y-4">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã SP</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{PRODUCT_CATEGORY_OPTIONS.filter(x => x.value === product.category)[0].label}</TableCell>
              {/* <TableCell>
                <Badge className={statusColors[product.status]}>
                  {product.status === 'available' && 'Có sẵn'}
                  {product.status === 'rented' && 'Đang cho thuê'}
                  {product.status === 'maintenance' && 'Đang bảo trì'}
                </Badge>
              </TableCell> */}
              <TableCell className="text-right">
                <ProductTableActions
                  product={product}
                  onEdit={onEdit}
                  setSelectedProduct={setSelectedProduct}
                  setShowDeleteDialog={setShowDeleteDialog}
                  setShowCheckModal={setShowCheckModal}/>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <DeleteProductConfirm
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        selectedProduct={selectedProduct}
        setSelectedProduct={setSelectedProduct}/>

      <CheckAvailableModal
        showCheckModal={showCheckModal}
        setShowCheckModal={setShowCheckModal}
        setSelectedProduct={setSelectedProduct}
        productId={selectedProduct?.id}
        productName={selectedProduct?.name}
      />

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

ProductTable.propTypes = {
  products: PropTypes.array,
  onEdit: PropTypes.func,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func
}