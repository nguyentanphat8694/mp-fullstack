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
import {useMutation, useQueryClient} from "@tanstack/react-query";
import request from "@/helpers/request.js";
import {URLs} from "@/helpers/url.js";
import {toast} from "@/hooks/use-toast.js";
import {useCallback} from "react";
import {QUERY_KEY} from "@/helpers/constants.js";

export const DeleteCustomerConfirm = ({customer, isDeleteDialogOpen, setIsDeleteDialogOpen, setSelectedCustomer}) => {
  const queryClient = useQueryClient();
  const {mutate, isPending} = useMutation({
    mutationFn: () => request(URLs.CUSTOMERS.DELETE(customer.id), {verb: 'delete'}),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
      toast({
        title: "Thành công",
        description: "Đã xóa khách hàng thành công.",
      });
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    },
  });
  const onDelete = useCallback(() => mutate(customer.id), [customer])
  return <AlertDialog
    open={isDeleteDialogOpen}
    onOpenChange={setIsDeleteDialogOpen}
  >
    <AlertDialogContent>
      <AlertDialogHeader>
        <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
        <AlertDialogDescription>
          Bạn có chắc chắn muốn xóa khách hàng {customer?.name}?
          Hành động này không thể hoàn tác.
        </AlertDialogDescription>
      </AlertDialogHeader>
      <AlertDialogFooter>
        <AlertDialogCancel
          onClick={() => {
            setIsDeleteDialogOpen(false);
            setSelectedCustomer(null);
          }}
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
  </AlertDialog>;
}

DeleteCustomerConfirm.propTypes = {
  customer: PropTypes.object,
  setIsDeleteDialogOpen: PropTypes.func,
  isDeleteDialogOpen: PropTypes.bool,
  setSelectedCustomer: PropTypes.func
}