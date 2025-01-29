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

const formSchema = z.object({
  type: z.enum(["income", "expense"]),
  amount: z.number().min(0),
  description: z.string().min(1, "Vui lòng nhập mô tả"),
  contract_id: z.string().optional()
})

export const TransactionForm = ({ 
  defaultValues,
  onSubmit,
  isSubmitting,
  contracts = []
}) => {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      type: "income",
      amount: 0
    }
  })

  const handleSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="type"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Loại giao dịch</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
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

        <FormField
          control={form.control}
          name="contract_id"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Hợp đồng (nếu có)</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Chọn hợp đồng" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {contracts.map(contract => (
                    <SelectItem key={contract.id} value={contract.id}>
                      {contract.code}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? "Đang xử lý..." : "Lưu giao dịch"}
        </Button>
      </form>
    </Form>
  )
} 