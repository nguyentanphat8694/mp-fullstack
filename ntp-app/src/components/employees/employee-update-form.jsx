import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CustomSelect from "@/components/ui-custom/custom-select"
import PropTypes from "prop-types"
import { useCallback } from "react"
import { STAFF_ROLE_OPTIONS } from "@/helpers/constants"
import useUserUpdateMutate from "@/queries/useUserUpdateMutate"
import { toast } from "@/hooks/use-toast"

const EmployeeUpdateForm = ({ employee, onClose }) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: {
      username: employee?.username || '',
      email: employee?.email || '',
      display_name: employee?.display_name || '',
    //   first_name: employee?.first_name || '',
    //   last_name: employee?.last_name || '',
      role: employee?.role || ''
    }
  });

  const { mutate, isPending } = useUserUpdateMutate(employee?.id, () => {
    toast({
      title: "Thành công",
      description: "Đã cập nhật thông tin nhân viên",
    });
    onClose?.();
  });

  const onSubmit = useCallback((data) => {
    mutate({
      username: data.username,
      email: data.email,
      role: data.role,
      display_name: data.display_name,
    //   first_name: data.first_name,
    //   last_name: data.last_name
    });
  }, [mutate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="username">Tên đăng nhập</Label>
        <Input
          id="username"
          disabled
          {...register("username")}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">Email</Label>
        <Input
          id="email"
          type="email"
          {...register("email", { 
            required: "Vui lòng nhập email",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Email không hợp lệ"
            }
          })}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Họ và tên</Label>
        <Input
            placeholder="Họ tên"
            {...register("display_name", { required: "Vui lòng nhập họ tên" })}
        />
        {errors.last_name && (
            <p className="text-sm text-destructive">{errors.display_name.message}</p>
        )}
        {/* <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Input
              placeholder="Họ"
              {...register("last_name", { required: "Vui lòng nhập họ" })}
            />
            {errors.last_name && (
              <p className="text-sm text-destructive">{errors.last_name.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Input
              placeholder="Tên"
              {...register("first_name", { required: "Vui lòng nhập tên" })}
            />
            {errors.first_name && (
              <p className="text-sm text-destructive">{errors.first_name.message}</p>
            )}
          </div>
        </div> */}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Vai trò</Label>
        <CustomSelect
          name="role"
          control={control}
          rules={{ required: "Vui lòng chọn vai trò" }}
          triggerName="Chọn vai trò"
          options={STAFF_ROLE_OPTIONS.filter(opt => opt.value !== 'all')}
        />
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="flex justify-end gap-4 pt-4">
        <Button 
          type="button" 
          variant="outline" 
          onClick={onClose}
        >
          Hủy
        </Button>
        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang xử lý..." : "Lưu"}
        </Button>
      </div>
    </form>
  )
}

EmployeeUpdateForm.propTypes = {
  employee: PropTypes.object.isRequired,
  onClose: PropTypes.func
}

export { EmployeeUpdateForm } 