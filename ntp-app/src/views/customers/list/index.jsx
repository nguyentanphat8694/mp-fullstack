import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { CustomerTable } from "@/components/customers/customer-table"
import { CustomerForm } from "@/components/customers/customer-form"
import { Search } from "lucide-react"
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
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

const CustomerListPage = () => {
  const { toast } = useToast()
  const navigate = useNavigate()
  const [customers, setCustomers] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedCustomer, setSelectedCustomer] = useState(null)
  const [staffList, setStaffList] = useState([])
  const [filterValues, setFilterValues] = useState({
    search: "",
    source: "all",
    status: "all"
  })

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

  const handleSearch = () => {
    // Thực hiện tìm kiếm với filterValues
    console.log("Searching with filters:", filterValues)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Danh sách khách hàng</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedCustomer(null)
        }}>
          <DialogTrigger asChild>
            <Button className="w-full sm:w-auto">
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
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Tìm kiếm khách hàng..."
              value={filterValues.search}
              onChange={(e) => setFilterValues(prev => ({ ...prev, search: e.target.value }))}
              className="col-span-1 sm:col-span-2 lg:col-span-2"
            />
            <Select
              value={filterValues.source}
              onValueChange={(value) => setFilterValues(prev => ({ ...prev, source: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Nguồn" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả nguồn</SelectItem>
                <SelectItem value="facebook">Facebook</SelectItem>
                <SelectItem value="tiktok">Tiktok</SelectItem>
                <SelectItem value="youtube">YouTube</SelectItem>
                <SelectItem value="walk-in">Vãng lai</SelectItem>
              </SelectContent>
            </Select>
            <Select
              value={filterValues.status}
              onValueChange={(value) => setFilterValues(prev => ({ ...prev, status: value }))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Trạng thái" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Tất cả trạng thái</SelectItem>
                <SelectItem value="new">Mới</SelectItem>
                <SelectItem value="contacted">Đã liên hệ</SelectItem>
                <SelectItem value="appointment">Có hẹn</SelectItem>
                <SelectItem value="contracted">Đã ký HĐ</SelectItem>
              </SelectContent>
            </Select>
            <Button 
              onClick={handleSearch}
              className="w-full"
            >
              <Search className="mr-2 h-4 w-4" />
              Tìm kiếm
            </Button>
          </div>

          <CustomerTable 
            customers={customers}
            onEdit={handleEdit}
            onAssign={handleAssign}
            onDelete={handleDelete}
            onAddAppointment={handleAddAppointment}
            staffList={staffList}
          />
        </div>
      )}
    </div>
  )
}

export default CustomerListPage 