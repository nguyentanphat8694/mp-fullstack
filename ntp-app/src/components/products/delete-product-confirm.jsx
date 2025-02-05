import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import {useCallback} from "react";
import PropTypes from "prop-types";

export const DeleteProductConfirm = ({showDeleteDialog, setShowDeleteDialog, selectedProduct, setSelectedProduct}) => {

  const handleDelete = useCallback(() => {
    setShowDeleteDialog(false)
    setSelectedProduct(null)
  }, []);
  return <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
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
};

DeleteProductConfirm.propTypes = {
  showDeleteDialog: PropTypes.bool,
  setShowDeleteDialog: PropTypes.func,
  selectedProduct: PropTypes.object,
  setSelectedProduct: PropTypes.func
}
