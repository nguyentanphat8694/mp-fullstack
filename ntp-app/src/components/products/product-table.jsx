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
import { Eye, Pencil, Trash2, Calendar } from "lucide-react"
import { useState } from "react"
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
import { CheckAvailableModal } from "./check-available-modal"

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

export const ProductTable = ({ 
  products = [], 
  onEdit, 
  onDelete,
  onViewDetail 
}) => {
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [showCheckModal, setShowCheckModal] = useState(false)

  const handleDelete = () => {
    onDelete(selectedProduct.id)
    setShowDeleteDialog(false)
    setSelectedProduct(null)
  }

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
                <div className="flex justify-end gap-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onViewDetail(product)}
                  >
                    <Eye className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(product)}
                  >
                    <Pencil className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowDeleteDialog(true)
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => {
                      setSelectedProduct(product)
                      setShowCheckModal(true)
                    }}
                  >
                    <Calendar className="h-4 w-4" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa sản phẩm {selectedProduct?.name}?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowDeleteDialog(false)
              setSelectedProduct(null)
            }}>
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>
              Xóa
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <CheckAvailableModal
        isOpen={showCheckModal}
        onClose={() => {
          setShowCheckModal(false)
          setSelectedProduct(null)
        }}
        productId={selectedProduct?.id}
        productName={selectedProduct?.name}
      />
    </>
  )
} 