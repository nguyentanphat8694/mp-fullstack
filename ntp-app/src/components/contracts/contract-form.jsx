import { useState } from "react"
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
import { DatePicker } from "@/components/ui/date-picker"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProductSelection } from "./product-selection"
import { PhotographerSchedule } from "./photographer-schedule"
import { ContractNotes } from "./contract-notes"
import { PaymentForm } from "./payment-form"

const formSchema = z.object({
  customer_id: z.string(),
  type: z.enum(["dress_rental", "wedding_photo", "pre_wedding_photo"]),
  start_date: z.date(),
  end_date: z.date(),
  total_amount: z.number().min(0),
  note: z.string().optional(),
  products: z.array(z.object({
    product_id: z.string(),
    rental_start: z.date(),
    rental_end: z.date()
  })).optional(),
  photographer_id: z.string().optional(),
})

export const ContractForm = ({ 
  defaultValues,
  onSubmit,
  isSubmitting 
}) => {
  const [selectedType, setSelectedType] = useState(defaultValues?.type || "dress_rental")
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: defaultValues || {
      type: "dress_rental",
      products: [],
      total_amount: 0
    }
  })

  const handleSubmit = (data) => {
    onSubmit(data)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Card>
          <CardContent className="p-6">
            <div className="grid gap-6 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customer_id"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Khách hàng</FormLabel>
                    <FormControl>
                      <CustomerSelect {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="type"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Loại hợp đồng</FormLabel>
                    <Select 
                      onValueChange={(value) => {
                        field.onChange(value)
                        setSelectedType(value)
                      }}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hợp đồng" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="dress_rental">Thuê váy cưới</SelectItem>
                        <SelectItem value="wedding_photo">Chụp ảnh cưới</SelectItem>
                        <SelectItem value="pre_wedding_photo">Chụp ảnh pre-wedding</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày bắt đầu</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Ngày kết thúc</FormLabel>
                    <FormControl>
                      <DatePicker
                        value={field.value}
                        onChange={field.onChange}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="total_amount"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tổng tiền</FormLabel>
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
            </div>
          </CardContent>
        </Card>

        <Tabs defaultValue="details">
          <TabsList>
            <TabsTrigger value="details">
              {selectedType === "dress_rental" ? "Sản phẩm cho thuê" : "Lịch chụp hình"}
            </TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
            <TabsTrigger value="notes">Ghi chú</TabsTrigger>
          </TabsList>

          <TabsContent value="details" className="space-y-4">
            {selectedType === "dress_rental" ? (
              <ProductSelection
                value={form.watch("products")}
                onChange={(products) => form.setValue("products", products)}
              />
            ) : (
              <PhotographerSchedule
                value={form.watch("photographer_id")}
                onChange={(id) => form.setValue("photographer_id", id)}
                type={selectedType}
                startDate={form.watch("start_date")}
                endDate={form.watch("end_date")}
              />
            )}
          </TabsContent>

          <TabsContent value="payment">
            <PaymentForm
              totalAmount={form.watch("total_amount")}
              onPaymentChange={(payments) => form.setValue("payments", payments)}
            />
          </TabsContent>

          <TabsContent value="notes">
            <ContractNotes
              value={form.watch("note")}
              onChange={(note) => form.setValue("note", note)}
            />
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4">
          <Button
            type="submit"
            disabled={isSubmitting}
          >
            {isSubmitting ? "Đang lưu..." : "Lưu hợp đồng"}
          </Button>
        </div>
      </form>
    </Form>
  )
} 