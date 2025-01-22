import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

const EmployeeForm = ({ employee, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: employee || {}
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="name">Họ tên</Label>
        <Input
          id="name"
          {...register("name", { required: "Vui lòng nhập họ tên" })}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
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
        <Label htmlFor="phone">Số điện thoại</Label>
        <Input
          id="phone"
          {...register("phone", { required: "Vui lòng nhập số điện thoại" })}
        />
        {errors.phone && (
          <p className="text-sm text-destructive">{errors.phone.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="role">Vai trò</Label>
        <Select 
          {...register("role", { required: "Vui lòng chọn vai trò" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn vai trò" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="admin">Admin</SelectItem>
            <SelectItem value="manager">Quản lý</SelectItem>
            <SelectItem value="accountant">Kế toán</SelectItem>
            <SelectItem value="telesale">Telesale</SelectItem>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="sale">Sale</SelectItem>
            <SelectItem value="photo-wedding">Photo Wedding</SelectItem>
            <SelectItem value="photo-pre-wedding">Photo Pre-wedding</SelectItem>
            <SelectItem value="tailor">Thợ may</SelectItem>
          </SelectContent>
        </Select>
        {errors.role && (
          <p className="text-sm text-destructive">{errors.role.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="status">Trạng thái</Label>
        <Select 
          {...register("status", { required: "Vui lòng chọn trạng thái" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="active">Đang làm</SelectItem>
            <SelectItem value="inactive">Đã nghỉ</SelectItem>
          </SelectContent>
        </Select>
        {errors.status && (
          <p className="text-sm text-destructive">{errors.status.message}</p>
        )}
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Lưu"}
      </Button>
    </form>
  )
}

export { EmployeeForm } 