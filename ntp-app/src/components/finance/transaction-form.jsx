import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { useToast } from "@/hooks/use-toast"
import useTransactionCreateMutate from "@/queries/useTransactionCreateMutate"
import useTransactionUpdateMutate from "@/queries/useTransactionUpdateMutate"
import PropTypes from "prop-types"

const formSchema = z.object({
  type: z.enum(["income", "expense"], {
    required_error: "Vui lòng chọn loại giao dịch"
  }),
  amount: z.number({
    required_error: "Vui lòng nhập số tiền"
  }).min(0, "Số tiền phải lớn hơn 0"),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  contract_id: z.string().optional()
})

export const TransactionForm = ({ 
  defaultValues,
  onSuccess,
  contracts = []
}) => {
  const { toast } = useToast();
  const isEditMode = Boolean(defaultValues?.id);

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      type: "income",
      amount: 0,
      description: ""
    }
  });

  // Create mutation
  const createMutation = useTransactionCreateMutate(() => {
    toast({
      title: "Thành công",
      description: "Đã tạo giao dịch mới"
    });
    onSuccess && onSuccess();
  });

  // Update mutation
  const updateMutation = useTransactionUpdateMutate(defaultValues?.id, () => {
    toast({
      title: "Thành công",
      description: "Đã cập nhật giao dịch"
    });
    onSuccess && onSuccess();
  });

  const onSubmit = async (data) => {
    try {
      if (isEditMode) {
        await updateMutation.mutateAsync(data);
      } else {
        await createMutation.mutateAsync(data);
      }
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau."
      });
    }
  };

  const isPending = isEditMode ? updateMutation.isPending : createMutation.isPending;

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giao dịch</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
                disabled={isEditMode}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn loại giao dịch" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="income">Thu</SelectItem>
                  <SelectItem value="expense">Chi</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="amount"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Số tiền</FormLabel>
              <FormControl>
                <Input
                  type="number"
                  {...field}
                  onChange={e => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="description"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Mô tả</FormLabel>
              <FormControl>
                <Textarea {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isPending}>
          {isPending ? "Đang xử lý..." : (isEditMode ? "Cập nhật" : "Tạo mới")}
        </Button>
      </form>
    </Form>
  )
}

TransactionForm.propTypes = {
  defaultValues: PropTypes.shape({
    id: PropTypes.number,
    type: PropTypes.oneOf(["income", "expense"]),
    amount: PropTypes.number,
    description: PropTypes.string
  }),
  onSuccess: PropTypes.func
}; 