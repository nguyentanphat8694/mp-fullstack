import {useEffect, useState} from "react"
import {useParams} from "react-router-dom"
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs"
import {CustomerDetailCard} from "@/components/customers/customer-detail-card"
import {CustomerAppointments} from "@/components/customers/customer-appointments"
import {CustomerHistory} from "@/components/customers/customer-history"
import {CustomerForm} from "@/components/customers/customer-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {useToast} from "@/hooks/use-toast"
import useCustomerDetailQuery from "@/queries/useCustomerDetailQuery.js";

const CustomerDetailPage = () => {
  const {id} = useParams()
  const {toast} = useToast()
  const [customer, setCustomer] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const {data, isPending} = useCustomerDetailQuery(id);
  useEffect(() => {
    const fetchData = async () => {
      try {
        setAppointments([
          {
            id: 1,
            date: "2024-01-20 09:00",
            note: "Hẹn tư vấn váy cưới",
            staff_name: "Nhân viên B"
          }
        ])
      } catch (error) {
        console.error("Error fetching customer data:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id])

  const handleEdit = async (data) => {
    try {
      setIsSubmitting(true)
      setCustomer({...customer, ...data})
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin khách hàng"
      })
      setIsEditOpen(false)
    } catch (error) {
      console.error("Error updating customer:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Chi tiết khách hàng</h1>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <CustomerForm
            customer={data?.data?.data}
            onSubmit={handleEdit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <Tabs defaultValue="info" className="space-y-6">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="history">Lịch sử</TabsTrigger>
        </TabsList>

        <TabsContent value="info" className="space-y-6">
          <CustomerDetailCard
            customer={data?.data?.data}
            onEdit={() => setIsEditOpen(true)}
            isPending={isPending}
          />
          <CustomerAppointments appointments={appointments}/>
        </TabsContent>

        <TabsContent value="history">
          <CustomerHistory customerId={id}/>
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomerDetailPage 