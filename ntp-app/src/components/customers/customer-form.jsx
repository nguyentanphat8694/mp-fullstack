import {useForm} from "react-hook-form"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {Label} from "@/components/ui/label"
import {Textarea} from "@/components/ui/textarea"
import {useCallback} from "react";
import CustomSelect from "@/components/ui-custom/custom-select";
import {CUSTOMER_SOURCE_OPTIONS, QUERY_KEY} from '@/helpers/constants';
import {useMutation, useQueryClient} from '@tanstack/react-query';
import request from "@/helpers/request";
import {URLs} from "@/helpers/url";
import {toast} from "@/hooks/use-toast";
import PropTypes from 'prop-types';

const CustomerForm = ({customer, setIsOpen, setSelectedCustomer}) => {
  const queryClient = useQueryClient();
  const {mutate, isPending} = useMutation({
    mutationFn: (params) => request(URLs.CUSTOMERS.CREATE, {
      verb: 'post',
      params
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
      toast({
        title: "Thành công",
        description: customer ? "Đã cập nhật thông tin khách hàng" : "Đã thêm khách hàng mới",
      });
      setIsOpen(false);
      setSelectedCustomer(null);
    },
  });

  const {mutate: mutateUpdate, isPending: isPendingUpdate} = useMutation({
    mutationFn: (params) => request(URLs.CUSTOMERS.UPDATE(customer.id), {
      verb: 'post',
      params
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [QUERY_KEY.CUSTOMER_LIST] });
      toast({
        title: "Thành công",
        description: customer ? "Đã cập nhật thông tin khách hàng" : "Đã thêm khách hàng mới",
      });
      setIsOpen(false);
      setSelectedCustomer(null);
    },
  });

  const onSubmitForm = useCallback((data) => {
    if (customer) {
      mutateUpdate(data)
    } else{
      mutate(data)
    }
  }, []);

  const {register, handleSubmit, formState: {errors}, control} = useForm({
    defaultValues: customer || {}
  })

  return (
    <form onSubmit={handleSubmit(onSubmitForm)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Họ tên</Label>
        <Input
          id="name"
          {...register("name", {required: "Vui lòng nhập họ tên"})}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          {...register("phone", {required: "Vui lòng nhập số điện thoại"})}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="source">Nguồn</Label>
        <CustomSelect
          name="source"
          control={control}
          rules={{required: "Vui lòng chọn nguồn"}}
          triggerName="Chọn nguồn"
          options={CUSTOMER_SOURCE_OPTIONS}
        />
        {errors.source && (
          <p className="text-sm text-destructive">{errors.source.message}</p>
        )}
      </div>

      {!customer && <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          id="note"
          {...register("note")}
        />
      </div>}

      <Button type="submit" disabled={isPending}>
        {(customer ? isPendingUpdate :  isPending) ? "Đang xử lý..." : "Lưu"}
      </Button>
    </form>
  )
}

export {CustomerForm}

CustomerForm.propTypes = {
  customer: PropTypes.object,
  setIsOpen: PropTypes.func,
  setSelectedCustomer: PropTypes.func
}