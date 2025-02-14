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
import { Textarea } from "@/components/ui/textarea";
import PropTypes from "prop-types";

export const CompleteAppointmentConfirm = ({
  showDialog,
  setShowDialog,
  appointment,
  onConfirm,
  isPending,
  note,
  setNote
}) => {
  return (
    <AlertDialog open={showDialog} onOpenChange={setShowDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận hoàn thành</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn hoàn thành lịch hẹn của khách hàng {appointment?.customer_name}?
          </AlertDialogDescription>
        </AlertDialogHeader>
        <div className="py-4">
          <Textarea
            placeholder="Ghi chú (không bắt buộc)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
            className="min-h-[100px]"
          />
        </div>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => setShowDialog(false)}>
            Đóng
          </AlertDialogCancel>
          <AlertDialogAction onClick={onConfirm} disabled={isPending}>
            {isPending ? "Đang xử lý..." : "Hoàn thành"}
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

CompleteAppointmentConfirm.propTypes = {
  showDialog: PropTypes.bool,
  setShowDialog: PropTypes.func,
  appointment: PropTypes.object,
  onConfirm: PropTypes.func,
  isPending: PropTypes.bool,
  note: PropTypes.string,
  setNote: PropTypes.func
}; 