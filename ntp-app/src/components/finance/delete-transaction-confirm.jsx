import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog"
import { useCallback } from "react"
import PropTypes from "prop-types"
import { useToast } from "@/hooks/use-toast"
import useTransactionDeleteMutate from "@/queries/useTransactionDeleteMutate"

export const DeleteTransactionConfirm = ({
  showDeleteDialog,
  setShowDeleteDialog,
  selectedTransaction,
  setSelectedTransaction
}) => {
  const { toast } = useToast();
  
  const onDeleteSuccess = useCallback(() => {
    toast({
      title: "Thành công",
      description: "Xóa giao dịch thành công",
    });
    setShowDeleteDialog(false);
    setSelectedTransaction(null);
  }, []);

  const deleteMutation = useTransactionDeleteMutate(onDeleteSuccess);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(selectedTransaction.id);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  }, [selectedTransaction?.id]);

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa giao dịch này?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setShowDeleteDialog(false);
            setSelectedTransaction(null);
          }}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground" 
            onClick={handleDelete}
            disabled={deleteMutation.isPending}
          >
            {deleteMutation.isPending ? "Đang xử lý..." : "Xóa"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

DeleteTransactionConfirm.propTypes = {
  showDeleteDialog: PropTypes.bool,
  setShowDeleteDialog: PropTypes.func,
  selectedTransaction: PropTypes.object,
  setSelectedTransaction: PropTypes.func
}; 