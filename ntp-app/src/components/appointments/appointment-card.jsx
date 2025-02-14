import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Calendar, Clock, User, Phone, FileText, X, CheckCircle } from "lucide-react"
import PropTypes from "prop-types"
import { useState, useCallback } from "react"
import { CancelAppointmentConfirm } from "./cancel-appointment-confirm"
import { useToast } from "@/hooks/use-toast"
import { CompleteAppointmentConfirm } from "./complete-appointment-confirm"
import useAppointmentAssignMutate from "@/queries/useAppointmentAssignMutate"
import useAppointmentCompleteMutate from "@/queries/useAppointmentCompleteMutate"
import {STATUS_COLORS, STATUS_LABELS} from "@/helpers/constants.js";

export const AppointmentCard = ({ appointment, currentUserId }) => {
  const { toast } = useToast()
  const [showCancelDialog, setShowCancelDialog] = useState(false)
  const [showCompleteDialog, setShowCompleteDialog] = useState(false)
  const [completeNote, setCompleteNote] = useState("")

  const assignMutation = useAppointmentAssignMutate(appointment.id, () => {
    toast({
      title: "Thành công",
      description: "Đã cập nhật trạng thái lịch hẹn"
    });
  });

  const completeMutation = useAppointmentCompleteMutate(appointment.id, () => {
    toast({
      title: "Thành công",
      description: "Đã hoàn thành lịch hẹn"
    });
    setShowCompleteDialog(false);
    setCompleteNote("");
  });

  const handleReceive = useCallback(async () => {
    try {
      await assignMutation.mutateAsync(true);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể tiếp nhận lịch hẹn"
      });
    }
  }, [appointment.id]);

  const handleCancel = useCallback(async () => {
    try {
      await assignMutation.mutateAsync(false);
      setShowCancelDialog(false);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể hủy tiếp nhận lịch hẹn"
      });
    }
  }, [appointment.id]);

  const handleComplete = useCallback(async () => {
    try {
      // Note: If you need to send the note, you'll need to update the API and mutation
      await completeMutation.mutateAsync({
        type: true,
        note: completeNote ?? '',
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể hoàn thành lịch hẹn"
      });
    }
  }, [appointment.id, completeNote]);
  const isAssignedToCurrentUser = appointment.assigned_to?.toString() === currentUserId?.toString();
  const canReceive = appointment.status === 'scheduled'
  const canCancel = appointment.status === 'receiving' && isAssignedToCurrentUser
  const canComplete = appointment.status === 'receiving' && isAssignedToCurrentUser
  return (
    <>
      <div className="bg-card rounded-lg border p-4 space-y-4">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Badge variant={STATUS_COLORS[appointment.status]}>
            {STATUS_LABELS[appointment.status]}
          </Badge>
          <span className="text-sm text-muted-foreground">
            {format(new Date(appointment.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}
          </span>
        </div>

        {/* Customer Info */}
        <div className="space-y-2 flex justify-between">
          <div className="flex items-center gap-2">
            <User className="h-4 w-4 text-primary" />
            <span className="font-medium">{appointment.customer_name}</span>
          </div>
          <div className="flex items-center gap-2">
            <Phone className="h-4 w-4 text-primary" />
            <span>{appointment.customer_phone}</span>
          </div>
        </div>

        {/* Appointment Info */}
        <div className=" flex justify-between gap-2 text-sm">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4 text-primary" />
            <span>{format(new Date(appointment.appointment_date), 'dd/MM/yyyy', { locale: vi })}</span>
          </div>
          <div className="flex items-center gap-2">
            <Clock className="h-4 w-4 text-primary" />
            <span>{format(new Date(appointment.appointment_date), 'HH:mm', { locale: vi })}</span>
          </div>
        </div>

        {/* Assigned To */}
        {appointment.assigned_to_name && (
          <div className="flex items-center gap-2 text-sm">
            <User className="h-4 w-4 text-primary" />
            <span>Người tiếp nhận: {appointment.assigned_to_name}</span>
          </div>
        )}

        {/* Note */}
        {appointment.note && (
          <div className="flex items-start gap-2 text-sm">
            <FileText className="h-4 w-4 text-primary shrink-0 mt-0.5" />
            <p className="text-muted-foreground line-clamp-2">{appointment.note}</p>
          </div>
        )}

        {/* Actions */}
        {(canReceive || canCancel || canComplete) && (
          <div className="flex gap-2 pt-2 border-t">
            {canReceive && (
              <Button 
                className="flex-1"
                onClick={handleReceive}
                disabled={assignMutation.isPending}
              >
                {assignMutation.isPending ? "Đang xử lý..." : "Tiếp nhận"}
              </Button>
            )}
            {canComplete && (
              <Button 
                className="flex-1"
                onClick={() => setShowCompleteDialog(true)}
                disabled={completeMutation.isPending}
              >
                <CheckCircle className="mr-2 h-4 w-4" />
                {completeMutation.isPending ? "Đang xử lý..." : "Hoàn thành"}
              </Button>
            )}
            {canCancel && (
              <Button 
                variant="outline"
                className="flex-1 text-destructive hover:text-destructive hover:bg-destructive/10"
                onClick={() => setShowCancelDialog(true)}
                disabled={assignMutation.isPending}
              >
                <X className="mr-2 h-4 w-4" />
                {assignMutation.isPending ? "Đang xử lý..." : "Hủy"}
              </Button>
            )}
          </div>
        )}
      </div>

      <CancelAppointmentConfirm
        showDialog={showCancelDialog}
        setShowDialog={setShowCancelDialog}
        appointment={appointment}
        onConfirm={handleCancel}
        isPending={assignMutation.isPending}
      />

      <CompleteAppointmentConfirm
        showDialog={showCompleteDialog}
        setShowDialog={setShowCompleteDialog}
        appointment={appointment}
        onConfirm={handleComplete}
        isPending={completeMutation.isPending}
        note={completeNote}
        setNote={setCompleteNote}
      />
    </>
  )
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object,
  currentUserId: PropTypes.number
}