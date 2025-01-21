import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CustomerTable } from "@/components/customers/customer-table"
import { CustomerForm } from "@/components/customers/customer-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { Plus } from "lucide-react"
import { URLs } from "@/helpers/url"

const CustomerListPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [staffList, setStaffList] = useState([])

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        // TODO: Call API to get customers
        const mockCustomers = [
          {
            id: 1,
            name: "Nguyễn Văn A",
            phone: "0123456789",
            source: "facebook",
            status: "new",
            assigned_to: "Nhân viên A"
          },
          // ... more mock data
        ]
        setCustomers(mockCustomers)
      } catch (error) {
        console.error("Error fetching customers:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchCustomers()
  }, [])

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        // TODO: Call API to get staff list
        const mockStaffList = [
          { id: "1", name: "Nhân viên A" },
          { id: "2", name: "Nhân viên B" },
          // ... more mock data
        ]
        setStaffList(mockStaffList)
      } catch (error) {
        console.error("Error fetching staff list:", error)
      }
    }

    fetchStaffList()
  }, [])

  const handleEdit = (customer) => {
    setSelectedCustomer(customer)
    setIsOpen(true)
  }

  const handleSubmit = async (data) => {
    try {
      setIsSubmitting(true)
      if (selectedCustomer) {
        // Update existing customer
        console.log("Updating customer:", data)
        toast({
          title: "Thành công",
          description: "Đã cập nhật thông tin khách hàng"
        })
      } else {
        // Create new customer
        console.log("Creating customer:", data)
        toast({
          title: "Thành công",
          description: "Đã thêm khách hàng mới"
        })
      }
      setIsOpen(false)
      setSelectedCustomer(null)
    } catch (error) {
      console.error("Error submitting customer:", error)
      toast({
        title: "Lỗi",
        description: "Không thể lưu thông tin",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleAssign = async (data) => {
    try {
      // TODO: Call API to assign customer
      await fetch(URLs.CUSTOMERS.ASSIGN(data.customerId), {
        method: 'POST',
        body: JSON.stringify({ staff_id: data.staffId })
      })
      
      toast({
        title: "Thành công",
        description: "Đã phân công khách hàng"
      })
    } catch (error) {
      console.error("Error assigning customer:", error)
      toast({
        title: "Lỗi",
        description: "Không thể phân công khách hàng",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleDelete = async (customerId) => {
    try {
      // TODO: Call API to delete customer
      await fetch(URLs.CUSTOMERS.DELETE(customerId), {
        method: 'DELETE'
      })
      
      setCustomers(customers.filter(c => c.id !== customerId))
      toast({
        title: "Thành công",
        description: "Đã xóa khách hàng"
      })
    } catch (error) {
      console.error("Error deleting customer:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa khách hàng",
        variant: "destructive"
      })
      throw error
    }
  }

  const handleAddAppointment = async (data) => {
    try {
      await fetch(URLs.APPOINTMENTS.CREATE, {
        method: 'POST',
        body: JSON.stringify(data)
      })
      
      toast({
        title: "Thành công",
        description: "Đã thêm lịch hẹn mới"
      })
    } catch (error) {
      console.error("Error adding appointment:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm lịch hẹn",
        variant: "destructive"
      })
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách khách hàng</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedCustomer(null)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm khách hàng
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedCustomer ? "Chỉnh sửa thông tin" : "Thêm khách hàng mới"}
              </DialogTitle>
            </DialogHeader>
            <CustomerForm 
              customer={selectedCustomer}
              onSubmit={handleSubmit} 
              isLoading={isSubmitting} 
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <CustomerTable 
          customers={customers}
          onEdit={handleEdit}
          onAssign={handleAssign}
          onDelete={handleDelete}
          onAddAppointment={handleAddAppointment}
          staffList={staffList}
        />
      )}
    </div>
  )
}

export default CustomerListPage 