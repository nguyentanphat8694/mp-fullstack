import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog.jsx";
import PropTypes from "prop-types";
import {useCallback} from "react";

export const DeleteEmployeeConfirm = ({
                                        isDeleteDialogOpen,
                                        setIsDeleteDialogOpen,
                                        selectedEmployee,
                                        setSelectedEmployee
                                      }) => {
  const isPending = false;
  const onDelete = useCallback(() => console.log('Delete'), [selectedEmployee]);
  const onCancel = useCallback(() => {
    setIsDeleteDialogOpen(false);
    setSelectedEmployee(null);
  }, [setIsDeleteDialogOpen]);
  return <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
        <AlertDialogDescription>
          Bạn có chắc chắn muốn xóa nhân viên {selectedEmployee?.name}?
          Hành động này không thể hoàn tác.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          onClick={onCancel}
        >
          Hủy
        </AlertDialogCancel>
        <AlertDialogAction
          onClick={onDelete}
          disabled={isPending}
          className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
        >
          {isPending ? "Đang xử lý..." : "Xóa"}
        </AlertDialogAction>
      </AlertDialogFooter>
    </AlertDialogContent>
  </AlertDialog>
};

DeleteEmployeeConfirm.propTypes = {
  isDeleteDialogOpen: PropTypes.bool,
  setIsDeleteDialogOpen: PropTypes.func,
  selectedEmployee: PropTypes.object,
  setSelectedEmployee: PropTypes.func,
};