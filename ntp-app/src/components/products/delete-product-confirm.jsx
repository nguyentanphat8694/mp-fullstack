import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import {useCallback} from "react";
import PropTypes from "prop-types";
import {useToast} from "@/hooks/use-toast";
import useProductDeleteMutate from "@/queries/useProductDeleteMutate";

export const DeleteProductConfirm = ({showDeleteDialog, setShowDeleteDialog, selectedProduct, setSelectedProduct}) => {
  const {toast} = useToast();
  const onDeleteSuccess = useCallback(() => {
    toast({
      title: "Thành công",
      description: "Xóa sản phẩm thành công",
    });
    setShowDeleteDialog(false);
    setSelectedProduct(null);
  }, []);

  const deleteMutation = useProductDeleteMutate(onDeleteSuccess);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(selectedProduct.id);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  }, [selectedProduct?.id]);

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
        <AlertDialogAction className='bg-destructive text-destructive-foreground' onClick={handleDelete} disabled={deleteMutation.isPending}>
          {deleteMutation.isPending ? "Đang xử lý..." : "Xóa"}
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
