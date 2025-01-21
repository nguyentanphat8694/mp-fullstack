import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { CustomerDetailCard } from "@/components/customers/customer-detail-card"
import { CustomerAppointments } from "@/components/customers/customer-appointments"
import { CustomerHistory } from "@/components/customers/customer-history"
import { CustomerForm } from "@/components/customers/customer-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const CustomerDetailPage = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const [customer, setCustomer] = useState(null)
  const [appointments, setAppointments] = useState([])
  const [history, setHistory] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // TODO: Call APIs to get customer data
        setCustomer({
          id: 1,
          name: "Nguyễn Văn A",
          phone: "0123456789",
          source: "facebook",
          status: "new",
          assigned_to: "Nhân viên A"
        })
        
        setAppointments([
          {
            id: 1,
            date: "2024-01-20 09:00",
            note: "Hẹn tư vấn váy cưới",
            staff_name: "Nhân viên B"
          }
        ])

        setHistory([
          {
            id: 1,
            date: "2024-01-15 14:30",
            staff_name: "Nhân viên A",
            action: "Tiếp nhận khách hàng",
            note: "Khách quan tâm đến váy cưới cao cấp"
          },
          {
            id: 2,
            date: "2024-01-16 10:00",
            staff_name: "Nhân viên B",
            action: "Gọi điện tư vấn",
            note: "Đã tư vấn các mẫu váy phù hợp"
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
      // TODO: Call API to update customer
      console.log("Updating customer:", data)
      
      setCustomer({ ...customer, ...data })
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
            customer={customer}
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
            customer={customer} 
            onEdit={() => setIsEditOpen(true)}
          />
          <CustomerAppointments appointments={appointments} />
        </TabsContent>

        <TabsContent value="history">
          <CustomerHistory history={history} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

export default CustomerDetailPage 