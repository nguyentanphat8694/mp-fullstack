import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Button} from "@/components/ui/button"
import {Badge} from "@/components/ui/badge"
import {Eye, Pencil, Trash2, Calendar} from "lucide-react"
import {useState} from "react"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import {CheckAvailableModal} from "./check-available-modal"
import {ProductTableActions} from "@/components/products/product-table-actions.jsx";
import {DeleteProductConfirm} from "@/components/products/delete-product-confirm.jsx";
import PropTypes from "prop-types";

const statusColors = {
  available: "bg-green-500",
  rented: "bg-blue-500",
  maintenance: "bg-yellow-500"
}

const categoryLabels = {
  wedding_dress: "Váy cưới",
  vest: "Vest",
  accessories: "Phụ kiện",
  ao_dai: "Áo dài"
}

export const ProductTable = ({products = [], onEdit}) => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCheckModal, setShowCheckModal] = useState(false)

  return (
    <>
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mã SP</TableHead>
            <TableHead>Tên sản phẩm</TableHead>
            <TableHead>Danh mục</TableHead>
            <TableHead>Trạng thái</TableHead>
            <TableHead className="text-right">Thao tác</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {products.map((product) => (
            <TableRow key={product.id}>
              <TableCell>{product.code}</TableCell>
              <TableCell>{product.name}</TableCell>
              <TableCell>{categoryLabels[product.category]}</TableCell>
              <TableCell>
                <Badge className={statusColors[product.status]}>
                  {product.status === 'available' && 'Có sẵn'}
                  {product.status === 'rented' && 'Đang cho thuê'}
                  {product.status === 'maintenance' && 'Đang bảo trì'}
                </Badge>
              </TableCell>
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
    </>
  )
}

ProductTable.propTypes = {
  products: PropTypes.array,
  onEdit: PropTypes.func,
}