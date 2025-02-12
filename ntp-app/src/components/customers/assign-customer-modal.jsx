import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {Button} from "@/components/ui/button"
import {Label} from "@/components/ui/label"
import {useCallback} from "react";
import {UserSelect} from "@/components/ui-custom/user-select/index.jsx";
import {useForm} from "react-hook-form";
import request from "@/helpers/request";
import {URLs} from "@/helpers/url.js";
import {useMutation, useQueryClient} from '@tanstack/react-query';
import {toast} from "@/hooks/use-toast.js";
import PropTypes from "prop-types";
import {QUERY_KEY} from '@/helpers/constants.js';

export const AssignCustomerModal = ({customer, isAssignModalOpen, setIsAssignModalOpen, setSelectedCustomer}) => {
  const queryClient = useQueryClient();
  const {mutate, isPending} = useMutation({
    mutationFn: (params) => request(URLs.CUSTOMERS.ASSIGN, {
      verb: 'post',
      params: {
        "user_id": params.user_id,
        "customer_id": customer.id,
      }
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
      toast({
        title: "Thành công",
        description: "Đã gán khách hàng thành công.",
      });
      setIsAssignModalOpen(false);
      setSelectedCustomer(null);
    },
  });
  const onClose = useCallback(() => {
    setIsAssignModalOpen(false);
    setSelectedCustomer(null);
  }, [])
  const onAssign = useCallback((data) => {
    mutate(data);
  }, []);
  const {handleSubmit, formState: {errors}, control} = useForm();
  return (
    <Dialog open={isAssignModalOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Phân công khách hàng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(onAssign)} className="space-y-4">
          <div className="space-y-2">
            <Label>Khách hàng</Label>
            <p className="text-sm font-medium">{customer?.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Trạng thái hiện tại</Label>
            <p className="text-sm font-medium capitalize">{customer?.status}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="user_id">Nhân viên phụ trách</Label>
            <UserSelect name="user_id" control={control} rules={{required: "Vui lòng chọn nhân viên"}} role="facebook"/>
            {errors.staff && (
              <p className="text-sm text-destructive">{errors.staff.message}</p>
            )}
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
              disabled={isPending}
            >
              {isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

AssignCustomerModal.propTypes = {
  customer: PropTypes.object,
  isAssignModalOpen: PropTypes.bool,
  setIsAssignModalOpen: PropTypes.func,
  setSelectedCustomer: PropTypes.func,
}
