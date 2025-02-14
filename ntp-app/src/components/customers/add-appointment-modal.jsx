import {useCallback} from "react"
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
import {useMutation, useQueryClient} from '@tanstack/react-query';
import request from "@/helpers/request";
import {URLs} from "@/helpers/url";
import {toast} from "@/hooks/use-toast";
import PropTypes from 'prop-types';
import {QUERY_KEY} from '@/helpers/constants.js';

export const AddAppointmentModal = ({ customer, isAppointmentModalOpen, setIsAppointmentModalOpen, setSelectedCustomer }) => {
  const queryClient = useQueryClient();
  
  const {register, handleSubmit, formState: {errors}, watch} = useForm({
    defaultValues: {
      date: "",
      time: "",
      note: ""
    }
  });

  const date = watch('date');
  const time = watch('time');

  const {mutate, isPending} = useMutation({
    mutationFn: (params) => request(URLs.APPOINTMENTS.CREATE, {
      verb: 'post',
      params
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
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
    console.log('data', data);
    mutate({
      customer_id: customer.id,
      appointment_date: `${data.date} ${data.time}`,
      note: data.note,
    });
  }, [customer?.id, mutate]);

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
              {...register("date", {
                required: "Vui lòng chọn ngày hẹn"
              })}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="time">Giờ hẹn</Label>
            <Input
              id="time"
              type="time"
              {...register("time", {
                required: "Vui lòng chọn giờ hẹn"
              })}
            />
            {errors.time && (
              <p className="text-sm text-destructive">{errors.time.message}</p>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="note">Ghi chú</Label>
            <Textarea
              id="note"
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