import { useState, useEffect } from "react"
import { useForm, useFieldArray, FormProvider } from "react-hook-form"
import { useParams, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import {
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
import CustomerSelect from "@/components/ui-custom/customer-select"
import { Plus, Trash2 } from "lucide-react"
import PropTypes from "prop-types"
import useContractCreateMutate from "@/queries/useContractCreateMutate"
import useContractUpdateMutate from "@/queries/useContractUpdateMutate"
import { useToast } from "@/hooks/use-toast"
import { PATHS } from "@/helpers/paths"
import useContractDetailQuery from "@/queries/useContractDetailQuery"
import { LoadingSpinner } from "@/components/loading-spinner"

const formSchema = z.object({
  // Main contract info (required)
  customer_id: z.number({
    required_error: "Vui lòng chọn khách hàng"
  }),
  type: z.enum(["dress_rental", "wedding_photo", "pre_wedding_photo"], {
    required_error: "Vui lòng chọn loại hợp đồng"
  }),
  total_amount: z.number({
    required_error: "Vui lòng nhập tổng tiền"
  }).min(0, "Tổng tiền phải lớn hơn 0"),
  start_date: z.date({
    required_error: "Vui lòng chọn ngày bắt đầu"
  }),
  end_date: z.date({
    required_error: "Vui lòng chọn ngày kết thúc"
  }),

  // Optional fields (no validation)
  note: z.string().optional(),
  
  // Optional payment array
  payments: z.array(z.object({
    amount: z.number().optional(),
    payment_method: z.string().optional(),
    payment_date: z.date().optional()
  })).optional(),

  // Optional product rentals
  products: z.array(z.object({
    product_id: z.string().optional(),
    rental_start: z.date().optional(),
    rental_end: z.date().optional()
  })).optional(),

  // Optional photographer schedule
  photographer: z.object({
    photographer_id: z.string().optional(),
    start_date: z.date().optional(),
    end_date: z.date().optional()
  }).optional()
});

// Mock data for testing edit mode
const mockContractDetail = {
  id: 1,
  main: {
    customer_id: 1,
    type: "dress_rental",
    start_date: "2024-02-15",
    end_date: "2024-02-20",
    total_amount: 15000000
  },
  note: {
    note: "Ghi chú test"
  },
  payment: {
    amount: 5000000,
    payment_method: "cash",
    payment_date: "2024-02-15"
  },
  product: {
    id: "1",
    rental_start: "2024-02-15",
    rental_end: "2024-02-20"
  },
  photographer: {
    id: "1",
    start_date: "2024-02-15",
    end_date: "2024-02-20"
  }
};

export const ContractForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("main");
  const isEditMode = Boolean(id);

  // Only fetch if in edit mode
  const { data: contractDetail, isLoading } = useContractDetailQuery(id, {
    enabled: isEditMode,
    onError: () => {
      toast({
        title: "Lỗi",
        description: "Không thể tải thông tin hợp đồng",
        variant: "destructive"
      });
      navigate(PATHS.CONTRACTS.LIST);
    }
  });

  const methods = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      payments: [
        {
          amount: 0,
          payment_method: 'cash',
          payment_date: new Date()
        }
      ]
    }
  });

  // Load contract data in edit mode
  useEffect(() => {
    if (isEditMode && contractDetail) {
      methods.reset({
        customer_id: contractDetail.main.customer_id,
        type: contractDetail.main.type,
        start_date: new Date(contractDetail.main.start_date),
        end_date: new Date(contractDetail.main.end_date),
        total_amount: contractDetail.main.total_amount,
        note: contractDetail.note?.note,
        payments: [{
          amount: contractDetail.payment?.amount || 0,
          payment_method: contractDetail.payment?.payment_method || 'cash',
          payment_date: contractDetail.payment?.payment_date ? new Date(contractDetail.payment.payment_date) : new Date()
        }],
        products: contractDetail.product ? [{
          product_id: contractDetail.product.id,
          rental_start: new Date(contractDetail.product.rental_start),
          rental_end: new Date(contractDetail.product.rental_end)
        }] : [],
        photographer: contractDetail.photographer ? {
          photographer_id: contractDetail.photographer.id,
          start_date: new Date(contractDetail.photographer.start_date),
          end_date: new Date(contractDetail.photographer.end_date)
        } : undefined
      });
    }
  }, [isEditMode, contractDetail, methods]);

  const { fields: paymentFields, append: appendPayment, remove: removePayment } = useFieldArray({
    control: methods.control,
    name: "payments"
  });

  // Create mutation
  const createMutation = useContractCreateMutate(() => {
    toast({
      title: "Thành công",
      description: "Đã tạo hợp đồng mới"
    });
    navigate(PATHS.CONTRACTS.LIST);
  });

  // Update mutation
  const updateMutation = useContractUpdateMutate(id, () => {
    toast({
      title: "Thành công",
      description: "Đã cập nhật hợp đồng"
    });
    navigate(PATHS.CONTRACTS.LIST);
  });

  const onSubmit = (data) => {
    const formattedData = {
      main: {
        customer_id: data.customer_id,
        type: data.type,
        start_date: data.start_date,
        end_date: data.end_date,
        total_amount: data.total_amount
      },
      note: data.note ? { note: data.note } : undefined,
      payment: data.payments?.[0] ? {
        amount: data.payments[0].amount,
        payment_date: data.payments[0].payment_date,
        payment_method: data.payments[0].payment_method
      } : undefined,
      product: data.products?.[0] ? {
        id: data.products[0].product_id,
        rental_start: data.products[0].rental_start,
        rental_end: data.products[0].rental_end
      } : undefined,
      photographer: data.photographer ? {
        id: data.photographer.photographer_id,
        start_date: data.photographer.start_date,
        end_date: data.photographer.end_date
      } : undefined
    };

    if (isEditMode) {
      updateMutation.mutate(formattedData);
    } else {
      createMutation.mutate(formattedData);
    }
  };

  const isPending = isEditMode ? updateMutation.isPending : createMutation.isPending;

  if (isEditMode && isLoading) {
    return <LoadingSpinner />;
  }

  return (
    <FormProvider {...methods}>
      <form onSubmit={methods.handleSubmit(onSubmit)}>
        <Tabs defaultValue="main" value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="main">Thông tin chính</TabsTrigger>
            <TabsTrigger value="products">Sản phẩm</TabsTrigger>
            <TabsTrigger value="photographer">Nhiếp ảnh</TabsTrigger>
            <TabsTrigger value="payment">Thanh toán</TabsTrigger>
          </TabsList>

          <TabsContent value="main">
            <Card>
              <CardContent className="pt-6 space-y-4">
                <FormField
                  control={methods.control}
                  name="customer_id"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Khách hàng</FormLabel>
                      <FormControl>
                        <CustomerSelect
                          value={field.value}
                          onValueChange={field.onChange}
                          placeholder="Chọn khách hàng..."
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={methods.control}
                  name="type"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Loại hợp đồng</FormLabel>
                      <Select
                        value={field.value}
                        onValueChange={field.onChange}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Chọn loại hợp đồng" />
                        </SelectTrigger>
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

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={methods.control}
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
                    control={methods.control}
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
                </div>

                <FormField
                  control={methods.control}
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

                <FormField
                  control={methods.control}
                  name="note"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Ghi chú</FormLabel>
                      <FormControl>
                        <Textarea {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="products">
            <FormField
              control={methods.control}
              name="products"
              render={({ field }) => (
                <ProductSelection
                  value={field.value}
                  onChange={field.onChange}
                />
              )}
            />
          </TabsContent>

          <TabsContent value="photographer">
            <FormField
              control={methods.control}
              name="photographer"
              render={({ field }) => (
                <PhotographerSchedule
                  control={methods.control}
                  name="photographer"
                  type={methods.watch("type")}
                />
              )}
            />
          </TabsContent>

          <TabsContent value="payment">
            <Card>
              <CardContent className="pt-6 space-y-4">
                {paymentFields.map((field, index) => (
                  <div key={field.id} className="space-y-4">
                    <div className="flex justify-between items-center">
                      <h4 className="text-sm font-medium">
                        Thanh toán {index + 1}
                      </h4>
                      {index > 0 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="icon"
                          onClick={() => removePayment(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <FormField
                        control={methods.control}
                        name={`payments.${index}.amount`}
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
                        control={methods.control}
                        name={`payments.${index}.payment_method`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Phương thức</FormLabel>
                            <Select
                              value={field.value}
                              onValueChange={field.onChange}
                            >
                              <SelectTrigger>
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                <SelectItem value="cash">Tiền mặt</SelectItem>
                                <SelectItem value="bank_transfer">Chuyển khoản</SelectItem>
                                <SelectItem value="card">Thẻ</SelectItem>
                              </SelectContent>
                            </Select>
                            <FormMessage />
                          </FormItem>
                        )}
                      />

                      <FormField
                        control={methods.control}
                        name={`payments.${index}.payment_date`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Ngày thanh toán</FormLabel>
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
                    </div>
                  </div>
                ))}

                <Button
                  type="button"
                  variant="outline"
                  onClick={() => appendPayment({
                    amount: 0,
                    payment_method: 'cash',
                    payment_date: new Date()
                  })}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Thêm thanh toán
                </Button>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>

        <div className="flex justify-end gap-4 mt-6">
          <Button type="submit" disabled={isPending}>
            {isPending ? "Đang xử lý..." : (isEditMode ? "Cập nhật" : "Tạo hợp đồng")}
          </Button>
        </div>
      </form>
    </FormProvider>
  );
};

ContractForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  isLoading: PropTypes.bool
}; 