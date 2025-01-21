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
import { Textarea } from "@/components/ui/textarea"

const CustomerForm = ({ customer, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors } } = useForm({
    defaultValues: customer || {}
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
        <Label htmlFor="source">Nguồn</Label>
        <Select 
          {...register("source", { required: "Vui lòng chọn nguồn" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn nguồn" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="facebook">Facebook</SelectItem>
            <SelectItem value="tiktok">Tiktok</SelectItem>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="walk-in">Vãng lai</SelectItem>
          </SelectContent>
        </Select>
        {errors.source && (
          <p className="text-sm text-destructive">{errors.source.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="note">Ghi chú</Label>
        <Textarea
          id="note"
          {...register("note")}
        />
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Lưu"}
      </Button>
    </form>
  )
}

export { CustomerForm } 