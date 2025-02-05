import {useCallback, useState} from "react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {Input} from "@/components/ui/input"
import {Textarea} from "@/components/ui/textarea"
import {useForm} from "react-hook-form";
import {useMutation} from "@tanstack/react-query";
import request from "@/helpers/request";
import {URLs} from "@/helpers/url";
import {toast} from "@/hooks/use-toast";
import PropTypes from 'prop-types';

export const AddAppointmentModal = ({ customer, isAppointmentModalOpen, setIsAppointmentModalOpen, setSelectedCustomer }) => {
  const [date, setDate] = useState("")
  const [time, setTime] = useState("")
  const [note, setNote] = useState("")

  const {mutate, isPending} = useMutation({
    mutationFn: (params) => request(URLs.APPOINTMENTS.CREATE, {
      verb: 'post',
      params
    }),
    onSuccess: () => {
      toast({
        title: "Thành công",
        description: "Đã thêm lịch hẹn thành công.",
      });
      setIsAppointmentModalOpen(false);
      setSelectedCustomer(null);
    },
  });

  const onClose = useCallback(() => {
    setIsAppointmentModalOpen(false);
    setSelectedCustomer(null);
  }, []);

  const onSubmit = useCallback((data) => {
    mutate({
      customer_id: customer.id,
      appointment_date: `${data.date} ${data.time}`,
    });
  }, []);

  const {register, handleSubmit, formState: {errors}, control} = useForm({
    defaultValues: customer || {}
  })

  return (
    <Dialog open={isAppointmentModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm lịch hẹn</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="space-y-2">
            <Label>Khách hàng</Label>
            <p className="text-sm font-medium">{customer?.name}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="date">Ngày hẹn</Label>
            <Input
              id="date"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              {...register("date", {required: "Vui lòng ngày hẹn"})}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Giờ hẹn</Label>
            <Input
              id="time"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              {...register("time", {required: "Vui lòng giờ hẹn"})}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.time.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Nhập ghi chú cho lịch hẹn..."
              {...register("note")}
            />
          </div>
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button
              type="submit"
              disabled={isPending || !date || !time}
            >
              {isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

AddAppointmentModal.propTypes = {
  customer: PropTypes.object,
  setIsAppointmentModalOpen: PropTypes.func,
  setSelectedCustomer: PropTypes.func,
  isAppointmentModalOpen: PropTypes.bool,
};