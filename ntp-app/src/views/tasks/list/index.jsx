import { useState, useEffect } from "react"
import { Plus, Search, Calendar as CalendarIcon, X, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskDetail } from "@/components/tasks/task-detail"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const TASK_STATUS = {
  ALL: 'all',
  PENDING: 'pending',
  IN_PROGRESS: 'in_progress',
  COMPLETED: 'completed'
}

const STATUS_LABELS = {
  [TASK_STATUS.ALL]: 'Tất cả',
  [TASK_STATUS.PENDING]: 'Chờ xử lý',
  [TASK_STATUS.IN_PROGRESS]: 'Đang thực hiện',
  [TASK_STATUS.COMPLETED]: 'Hoàn thành'
}

const MOCK_TASKS = [
  {
    id: 1,
    title: "Kiểm tra váy cưới mã VC001",
    description: "Kiểm tra tình trạng váy sau khi khách trả",
    assigned_to: { id: 1, name: "Nguyễn Văn A", avatar: null },
    status: TASK_STATUS.PENDING,
    due_date: "2024-02-21",
    priority: "high",
    created_by: { id: 1, name: "Admin" },
    created_at: "2024-02-20T08:00:00Z",
    updated_at: "2024-02-20T08:00:00Z"
  },
  {
    id: 2,
    title: "Chụp ảnh cưới cho khách hàng Trần Thị B",
    description: "Buổi chụp tại studio",
    assigned_to: { id: 2, name: "Trần Văn B", avatar: null },
    status: TASK_STATUS.IN_PROGRESS,
    due_date: "2024-02-22",
    priority: "medium",
    created_by: { id: 1, name: "Admin" },
    created_at: "2024-02-20T09:00:00Z",
    updated_at: "2024-02-20T09:00:00Z"
  },
  {
    id: 3,
    title: "Sửa váy cưới mã VC002",
    description: "Chỉnh sửa theo yêu cầu khách hàng",
    assigned_to: { id: 3, name: "Lê Thị C", avatar: null },
    status: TASK_STATUS.COMPLETED,
    due_date: "2024-02-20",
    priority: "low",
    created_by: { id: 1, name: "Admin" },
    created_at: "2024-02-19T08:00:00Z",
    updated_at: "2024-02-20T10:00:00Z"
  }
]

const PRIORITY_COLORS = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-rose-100 text-rose-700"
}

const TaskListPage = () => {
  const { toast } = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isLoading, setIsLoading] = useState(false)
  const [tasks, setTasks] = useState(MOCK_TASKS)
  
  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedStatus, setSelectedStatus] = useState(TASK_STATUS.ALL)

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         task.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesEmployee = selectedEmployee === "all" || task.assigned_to.id.toString() === selectedEmployee
    const matchesDate = format(new Date(task.created_at), 'yyyy-MM-dd') === format(selectedDate, 'yyyy-MM-dd')
    const matchesStatus = selectedStatus === TASK_STATUS.ALL || task.status === selectedStatus
    return matchesSearch && matchesEmployee && matchesDate && matchesStatus
  })

  const handleCreate = async (data) => {
    try {
      setIsLoading(true)
      // API call here
      const newTask = {
        id: tasks.length + 1,
        ...data,
        created_by: { id: 1, name: "Admin" },
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      }
      setTasks([...tasks, newTask])
      setIsCreateOpen(false)
      toast({
        title: "Thành công",
        description: "Đã tạo công việc mới"
      })
    } catch (error) {
      console.error("Error creating task:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tạo công việc",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setSelectedTask(null)
    }
  }

  const handleEdit = async (data) => {
    try {
      setIsLoading(true)
      // API call here
      const updatedTasks = tasks.map(task => 
        task.id === selectedTask.id 
          ? { 
              ...task, 
              ...data,
              updated_at: new Date().toISOString() 
            }
          : task
      )
      setTasks(updatedTasks)
      setIsCreateOpen(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật công việc"
      })
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật công việc",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setSelectedTask(null)
    }
  }

  const handleDelete = async (taskId) => {
    try {
      setIsLoading(true)
      // API call here
      const updatedTasks = tasks.filter(task => task.id !== taskId)
      setTasks(updatedTasks)
      toast({
        title: "Thành công",
        description: "Đã xóa công việc"
      })
    } catch (error) {
      console.error("Error deleting task:", error)
      toast({
        title: "Lỗi",
        description: "Không thể xóa công việc",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      setIsLoading(true)
      // API call here
      const updatedTasks = tasks.map(task =>
        task.id === taskId
          ? {
              ...task,
              status: newStatus,
              updated_at: new Date().toISOString()
            }
          : task
      )
      setTasks(updatedTasks)
      setIsDetailOpen(false)
      toast({
        title: "Thành công",
        description: "Đã cập nhật trạng thái công việc"
      })
    } catch (error) {
      console.error("Error updating task status:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
      setSelectedTask(null)
    }
  }

  const handleTaskClick = (task) => {
    setSelectedTask(task)
    setIsDetailOpen(true)
  }

  const handleEditClick = (e, task) => {
    e.stopPropagation()
    setSelectedTask(task)
    setIsCreateOpen(true)
  }

  const handleDeleteClick = (e, taskId) => {
    e.stopPropagation()
    handleDelete(taskId)
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Danh sách công việc</h1>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Tạo công việc
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="relative">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Tìm kiếm công việc..."
            className="pl-8"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <Select 
          value={selectedEmployee} 
          onValueChange={setSelectedEmployee}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn nhân viên" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Tất cả nhân viên</SelectItem>
            <SelectItem value="1">Nguyễn Văn A</SelectItem>
            <SelectItem value="2">Trần Văn B</SelectItem>
            <SelectItem value="3">Lê Thị C</SelectItem>
          </SelectContent>
        </Select>

        <Select 
          value={selectedStatus} 
          onValueChange={setSelectedStatus}
        >
          <SelectTrigger>
            <SelectValue placeholder="Chọn trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {Object.entries(STATUS_LABELS).map(([value, label]) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Popover>
          <PopoverTrigger asChild>
            <Button variant="outline" className="w-full justify-start text-left font-normal">
              <CalendarIcon className="mr-2 h-4 w-4" />
              {format(selectedDate, 'dd/MM/yyyy', { locale: vi })}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              locale={vi}
            />
          </PopoverContent>
        </Popover>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{STATUS_LABELS[status]}</h2>
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                {tasks.filter(t => t.status === status).length}
              </span>
            </div>
            
            <div className="space-y-3">
              {tasks
                .filter(task => task.status === status)
                .map(task => (
                  <div
                    key={task.id}
                    className="bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => handleTaskClick(task)}
                  >
                    <div className="flex justify-between items-start mb-3">
                      <h3 className="font-medium hover:text-primary">
                        {task.title}
                      </h3>
                      <div className="flex gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8"
                          onClick={(e) => handleEditClick(e, task)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={(e) => handleDeleteClick(e, task.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.assigned_to.avatar} />
                          <AvatarFallback>{task.assigned_to.name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.assigned_to.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
                        {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
                      </span>
                    </div>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4" />
                        <span className="text-xs">
                          {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: vi })}
                        </span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>

      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? "Chỉnh sửa công việc" : "Tạo công việc mới"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            onSubmit={selectedTask ? handleEdit : handleCreate}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <TaskDetail
            task={selectedTask}
            onStatusChange={handleStatusChange}
            onClose={() => setIsDetailOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskListPage 