import { useState, useCallback } from "react"
import { Plus, Users } from "lucide-react"
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
import useUserListQuery from "@/queries/useUserListQuery"
import { CustomPageTitle } from "@/components/ui-custom/custom-page-title"

const EmployeeListPage = () => {
  const { toast } = useToast()
  const [isOpen, setIsOpen] = useState(false)
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [currentPage, setCurrentPage] = useState(1)
  const itemsPerPage = 10

  // Filter states
  const [filterParams, setFilterParams] = useState({
    search: "",
    role: "all",
    offset: 0
  })

  const { data, isLoading } = useUserListQuery(filterParams)

  const handleEdit = useCallback((employee) => {
    setSelectedEmployee(employee)
    setIsOpen(true)
  }, [])

  const handlePageChange = useCallback((page) => {
    setCurrentPage(page)
    setFilterParams(prev => ({
      ...prev,
      offset: (page - 1) * itemsPerPage
    }))
  }, [])

  const handleSearch = useCallback((searchValue, roleValue) => {
    setCurrentPage(1)
    setFilterParams({
      search: searchValue,
      role: roleValue,
      offset: 0
    })
  }, [])

  return (
    <div className="space-y-6">
      <CustomPageTitle 
        title="Danh sách nhân viên" 
        icon={<Users className="h-6 w-6 text-primary" />} 
      />

      <div className="flex justify-end">
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
              onClose={() => setIsOpen(false)}
            />
          </DialogContent>
        </Dialog>
      </div>

      {isLoading ? (
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        </div>
      ) : (
        <EmployeeTable 
          employees={data?.data?.data?.data || []}
          onEdit={handleEdit}
          onSearch={handleSearch}
          currentPage={currentPage}
          totalPages={Math.ceil((data?.data?.data?.total_data || 0) / itemsPerPage)}
          onPageChange={handlePageChange}
        />
      )}
    </div>
  )
}

export default EmployeeListPage 