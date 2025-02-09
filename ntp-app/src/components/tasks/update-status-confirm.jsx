import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import PropTypes from "prop-types";

export const UpdateStatusConfirm = ({
  showDialog,
  setShowDialog,
  currentStatus,
  onConfirm,
  isPending
}) => {
  const getStatusText = (status) => {
    switch(status) {
      case 'pending':
        return 'bắt đầu thực hiện';
      case 'in_progress':
        return 'hoàn thành';
      default:
        return '';
    }
  };

  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận thay đổi trạng thái</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn {getStatusText(currentStatus)} công việc này?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDialog(false)}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Xác nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

UpdateStatusConfirm.propTypes = {
  showDialog: PropTypes.bool,
  setShowDialog: PropTypes.func,
  currentStatus: PropTypes.string,
  onConfirm: PropTypes.func,
  isPending: PropTypes.bool
}; 