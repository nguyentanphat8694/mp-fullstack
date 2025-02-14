import { useState, useCallback } from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { STAFF_ROLE_OPTIONS } from "@/helpers/constants"
import CustomSelect from "@/components/ui-custom/custom-select"
import { EmployeeTableActions } from "@/components/employees/employee-table-actions"
import { DeleteEmployeeConfirm } from "@/components/employees/delete-employee-confirm"
import { AddRewardModal } from "@/components/employees/add-reward-modal"
import { Pagination } from "@/components/ui/pagination"
import PropTypes from "prop-types"

const EmployeeTable = ({ 
  employees = [], 
  onEdit, 
  onSearch,
  currentPage,
  totalPages,
  onPageChange 
}) => {
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRewardOpen, setIsRewardOpen] = useState(false)

  const handleSearchChange = useCallback((e) => {
    setSearchQuery(e.target.value)
    onSearch(e.target.value, roleFilter)
  }, [onSearch, roleFilter])

  const handleRoleChange = useCallback((value) => {
    setRoleFilter(value)
    onSearch(searchQuery, value)
  }, [onSearch, searchQuery])

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Tìm kiếm nhân viên..."
          value={searchQuery}
          onChange={handleSearchChange}
          className="flex-1"
        />
        <CustomSelect
          className="w-[180px]"
          value={roleFilter}
          onValueChange={handleRoleChange}
          triggerName="Vai trò"
          options={STAFF_ROLE_OPTIONS}
        />
      </div>

      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Email</TableHead>
              <TableHead>Username</TableHead>
              <TableHead>Ngày tạo</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {employees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.display_name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.username}</TableCell>
                <TableCell>{new Date(employee.created_at).toLocaleDateString('vi-VN')}</TableCell>
                <TableCell>
                  <EmployeeTableActions
                    employee={employee}
                    onEdit={onEdit}
                    setSelectedEmployee={setSelectedEmployee}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    setIsRewardOpen={setIsRewardOpen}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <Pagination 
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={onPageChange}
      />

      <DeleteEmployeeConfirm
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}
      />
      
      <AddRewardModal
        employee={selectedEmployee}
        setIsRewardOpen={setIsRewardOpen}
        isRewardOpen={isRewardOpen}
      />
    </div>
  )
}

EmployeeTable.propTypes = {
  employees: PropTypes.array,
  onEdit: PropTypes.func,
  onSearch: PropTypes.func,
  currentPage: PropTypes.number,
  totalPages: PropTypes.number,
  onPageChange: PropTypes.func
}

export { EmployeeTable }