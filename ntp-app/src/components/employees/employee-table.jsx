import {useState} from "react"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import {Input} from "@/components/ui/input"
import {STAFF_ROLE_OPTIONS} from "@/helpers/constants.js";
import CustomSelect from "@/components/ui-custom/custom-select/index.jsx";
import {EmployeeTableActions} from "@/components/employees/employee-table-actions.jsx";
import {DeleteEmployeeConfirm} from "@/components/employees/delete-employee-confirm.jsx";
import {AddRewardModal} from "@/components/employees/add-reward-modal.jsx";
import PropTypes from "prop-types";

const EmployeeTable = ({ employees = [], onEdit }) => {
  const [roleFilter, setRoleFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [isRewardOpen, setIsRewardOpen] = useState(false)

  const filteredEmployees = employees.filter(employee => {
    if (roleFilter !== "all" && employee.role !== roleFilter) return false
    if (searchQuery && !employee.name.toLowerCase().includes(searchQuery.toLowerCase())) return false
    return true
  })

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-4">
        <Input
          placeholder="Tìm kiếm nhân viên..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="flex-1"
        />
        <CustomSelect
          className="w-[180px]"
          value={roleFilter}
          onValueChange={setRoleFilter}
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
              <TableHead>Số điện thoại</TableHead>
              <TableHead>Vai trò</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredEmployees.map((employee) => (
              <TableRow key={employee.id}>
                <TableCell>{employee.name}</TableCell>
                <TableCell>{employee.email}</TableCell>
                <TableCell>{employee.phone}</TableCell>
                <TableCell className="capitalize">{employee.role}</TableCell>
                <TableCell>
                  <span className={`px-2 py-1 rounded-full text-xs ${
                    employee.status === 'active'
                      ? 'bg-green-100 text-green-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {employee.status === 'active' ? 'Đang làm' : 'Đã nghỉ'}
                  </span>
                </TableCell>
                <TableCell>
                  <EmployeeTableActions
                    employee={employee}
                    onEdit={onEdit}
                    setSelectedEmployee={setSelectedEmployee}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    setIsRewardOpen={setIsRewardOpen}
                    isRewardOpen={isRewardOpen}/>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      <DeleteEmployeeConfirm
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        selectedEmployee={selectedEmployee}
        setSelectedEmployee={setSelectedEmployee}/>
      <AddRewardModal
        employee={selectedEmployee}
        setIsRewardOpen={setIsRewardOpen}
        isRewardOpen={isRewardOpen}
      />
    </div>
  )
}

export {EmployeeTable}

EmployeeTable.propTypes = {
  employees: PropTypes.array,
  onEdit: PropTypes.func,
}