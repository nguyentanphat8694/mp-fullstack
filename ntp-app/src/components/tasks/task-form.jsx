import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
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
import { UserSelect } from "@/components/ui-custom/user-select"
import useTaskCreateMutate from "@/queries/useTaskCreateMutate"
import useTaskUpdateMutate from "@/queries/useTaskUpdateMutate"
import { useToast } from "@/hooks/use-toast"
import { useCallback } from "react"

const TaskForm = ({ task, onClose }) => {
  const { toast } = useToast()
  const onSuccess = useCallback(() => {
    toast({
      title: "Thành công",
      description: task ? "Cập nhật công việc thành công" : "Thêm công việc mới thành công",
    });
    onClose && onClose();
  }, [task]);

  const createMutation = useTaskCreateMutate(onSuccess);
  const updateMutation = useTaskUpdateMutate(task?.id, onSuccess);

  const { register, handleSubmit, formState: { errors }, watch, setValue, control } = useForm({
    defaultValues: task || {
      title: "",
      description: "",
      assigned_to: "",
      due_date: new Date(),
      status: "pending"
    }
  });

  const onSubmit = async (data) => {
    try {
      if (task) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  };

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
        <UserSelect
          name="assigned_to"
          control={control}
          rules={{ required: "Vui lòng chọn người thực hiện" }}
          role={["sale", "photo-wedding", "photo-pre-wedding", "tailor"]}
        />
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

      <Button type="submit">
        {task ? updateMutation.isPending : createMutation.isPending ? "Đang xử lý..." : task ? "Cập nhật" : "Thêm"}
      </Button>
    </form>
  )
}

export { TaskForm } 