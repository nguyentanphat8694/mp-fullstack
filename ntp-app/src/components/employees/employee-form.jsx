import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import CustomSelect from "@/components/ui-custom/custom-select"
import PropTypes from "prop-types"
import { useCallback } from "react"
import { STAFF_ROLE_OPTIONS } from "@/helpers/constants"
import useUserCreateMutate from "@/queries/useUserCreateMutate"
import { toast } from "@/hooks/use-toast"

const EmployeeForm = ({ employee, onClose }) => {
  const { register, handleSubmit, formState: { errors }, control } = useForm({
    defaultValues: employee || {
      role: 'sale' // default role
    }
  });

  const { mutate, isPending } = useUserCreateMutate(() => {
    toast({
      title: "Thành công",
      description: "Đã thêm nhân viên mới",
    });
    onClose?.();
  });

  const onSubmit = useCallback((data) => {
    mutate({
      username: data.username,
      password: data.password,
      email: data.email,
      role: data.role,
      first_name: data.first_name,
      last_name: data.last_name
    });
  }, [mutate]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="username">Tên đăng nhập</Label>
        <Input
          id="username"
          {...register("username", { 
            required: "Vui lòng nhập tên đăng nhập",
            minLength: {
              value: 3,
              message: "Tên đăng nhập phải có ít nhất 3 ký tự"
            }
          })}
        />
        {errors.username && (
          <p className="text-sm text-destructive">{errors.username.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Mật khẩu</Label>
        <Input
          id="password"
          type="password"
          {...register("password", { 
            required: "Vui lòng nhập mật khẩu",
            minLength: {
              value: 6,
              message: "Mật khẩu phải có ít nhất 6 ký tự"
            }
          })}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="first_name">Tên</Label>
          <Input
            id="first_name"
            {...register("first_name", { required: "Vui lòng nhập tên" })}
          />
          {errors.first_name && (
            <p className="text-sm text-destructive">{errors.first_name.message}</p>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="last_name">Họ</Label>
          <Input
            id="last_name"
            {...register("last_name", { required: "Vui lòng nhập họ" })}
          />
          {errors.last_name && (
            <p className="text-sm text-destructive">{errors.last_name.message}</p>
          )}
        </div>
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

      <div className="flex justify-end gap-4">
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

EmployeeForm.propTypes = {
  employee: PropTypes.object,
  onClose: PropTypes.func
}

export { EmployeeForm }