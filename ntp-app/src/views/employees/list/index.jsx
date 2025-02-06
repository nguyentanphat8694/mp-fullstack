import { useEffect, useState } from "react"
import { Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import { EmployeeTable } from "@/components/employees/employee-table"
import { EmployeeForm } from "@/components/employees/employee-form"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"

const EmployeeListPage = () => {
  const { toast } = useToast()
  const [employees, setEmployees] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)

  useEffect(() => {
    const fetchEmployees = async () => {
      try {
        // Mock data
        const mockEmployees = [
          {
            id: 1,
            name: "Nguyễn Văn A",
            position: "Nhân viên tư vấn",
            phone: "0123456789",
            email: "nva@example.com",
            status: "active",
            join_date: "2024-01-01"
          },
          // ... more mock data
        ]
        setEmployees(mockEmployees)
      } catch (error) {
        console.error("Error fetching employees:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách nhân viên",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchEmployees()
  }, [toast])

  const handleEdit = (employee) => {
    setSelectedEmployee(employee)
    setIsOpen(true)
  }

  const handleDelete = async (employeeId) => {
    try {
      // Mock API call
      setEmployees(employees.filter(emp => emp.id !== employeeId))
      toast({
        title: "Thành công",
        description: "Đã xóa nhân viên"
      })
    } catch (error) {
      console.error("Error deleting employee:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa nhân viên",
        variant: "destructive"
      })
      throw error
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách nhân viên</h1>
        <Dialog open={isOpen} onOpenChange={(open) => {
          setIsOpen(open)
          if (!open) setSelectedEmployee(null)
        }}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="mr-2 h-4 w-4" />
              Thêm nhân viên
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[425px]">
            <DialogHeader>
              <DialogTitle>
                {selectedEmployee ? "Chỉnh sửa thông tin" : "Thêm nhân viên mới"}
              </DialogTitle>
            </DialogHeader>
            <EmployeeForm 
              employee={selectedEmployee}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div>Loading...</div>
      ) : (
        <EmployeeTable 
          employees={employees}
          onEdit={handleEdit}
          onDelete={handleDelete}
        />
      )}
    </div>
  )
}

export default EmployeeListPage 