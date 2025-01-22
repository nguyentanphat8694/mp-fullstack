import { useState } from "react"
import { useNavigate } from "react-router-dom"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const statusColors = {
  pending: "default",
  inProgress: "warning",
  completed: "success",
  overdue: "destructive"
}

const statusLabels = {
  pending: "Chờ xử lý",
  inProgress: "Đang thực hiện",
  completed: "Hoàn thành",
  overdue: "Quá hạn"
}

const TaskTable = ({ tasks = [], onStatusChange }) => {
  const navigate = useNavigate()
  const [statusFilter, setStatusFilter] = useState("all")
  const [searchQuery, setSearchQuery] = useState("")

  const filteredTasks = tasks.filter(task => {
    const matchesStatus = statusFilter === "all" || task.status === statusFilter
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      task.assignee.name.toLowerCase().includes(searchQuery.toLowerCase())
    return matchesStatus && matchesSearch
  })

  return (
    <div className="space-y-4">
      <div className="flex gap-4">
        <Input
          placeholder="Tìm kiếm công việc..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="max-w-sm"
        />
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Trạng thái" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả</SelectItem>
            <SelectItem value="pending">Chờ xử lý</SelectItem>
            <SelectItem value="inProgress">Đang thực hiện</SelectItem>
            <SelectItem value="completed">Hoàn thành</SelectItem>
            <SelectItem value="overdue">Quá hạn</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Tiêu đề</TableHead>
              <TableHead>Người thực hiện</TableHead>
              <TableHead>Ngày bắt đầu</TableHead>
              <TableHead>Hạn hoàn thành</TableHead>
              <TableHead>Trạng thái</TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredTasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>{task.assignee.name}</TableCell>
                <TableCell>
                  {format(new Date(task.startDate), 'dd/MM/yyyy', { locale: vi })}
                </TableCell>
                <TableCell>
                  {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: vi })}
                </TableCell>
                <TableCell>
                  <Badge variant={statusColors[task.status]}>
                    {statusLabels[task.status]}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Button
                    variant="ghost"
                    onClick={() => navigate(`/tasks/${task.id}`)}
                  >
                    Chi tiết
                  </Button>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

export { TaskTable } 