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

export const CancelAppointmentConfirm = ({
  showDialog,
  setShowDialog,
  appointment,
  onConfirm,
  isPending
}) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hủy tiếp nhận</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hủy tiếp nhận lịch hẹn của khách hàng {appointment?.customer_name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDialog(false)}>
            Đóng
          </AlertDialogCancel>
          <AlertDialogAction 
            onClick={onConfirm} 
            disabled={isPending}
            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
          >
            {isPending ? "Đang xử lý..." : "Hủy tiếp nhận"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

CancelAppointmentConfirm.propTypes = {
  showDialog: PropTypes.bool,
  setShowDialog: PropTypes.func,
  appointment: PropTypes.object,
  onConfirm: PropTypes.func,
  isPending: PropTypes.bool
}; 