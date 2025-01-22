import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { CalendarIcon } from "lucide-react"
import { cn } from "@/lib/utils"

const TaskForm = ({ task, onSubmit, isLoading }) => {
  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: task || {
      title: "",
      description: "",
      assigned_to: "",
      due_date: new Date(),
      status: "pending"
    }
  })

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      <div className="space-y-2">
        <Label htmlFor="title">Tiêu đề</Label>
        <Input
          id="title"
          {...register("title", { required: "Vui lòng nhập tiêu đề" })}
        />
        {errors.title && (
          <p className="text-sm text-destructive">{errors.title.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="description">Mô tả</Label>
        <Textarea
          id="description"
          {...register("description")}
          rows={4}
        />
      </div>

      <div className="space-y-2">
        <Label htmlFor="assigned_to">Người thực hiện</Label>
        <Select 
          {...register("assigned_to", { required: "Vui lòng chọn người thực hiện" })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            {/* API call to get employees */}
            <SelectItem value="1">Nguyễn Văn A</SelectItem>
            <SelectItem value="2">Trần Thị B</SelectItem>
          </SelectContent>
        </Select>
        {errors.assigned_to && (
          <p className="text-sm text-destructive">{errors.assigned_to.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label>Hạn hoàn thành</Label>
        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !watch("due_date") && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4" />
              {watch("due_date") ? (
                format(watch("due_date"), "PPP", { locale: vi })
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={watch("due_date")}
              onSelect={(date) => setValue("due_date", date)}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      <Button type="submit" disabled={isLoading}>
        {isLoading ? "Đang xử lý..." : "Lưu"}
      </Button>
    </form>
  )
}

export { TaskForm } 