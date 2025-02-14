import {useState} from "react"
import {Plus, Search, Calendar as CalendarIcon, Edit, Trash2, FolderKanban, ChevronDown} from "lucide-react"
import {Button} from "@/components/ui/button"
import {Input} from "@/components/ui/input"
import {TaskForm} from "@/components/tasks/task-form"
import {TaskDetail} from "@/components/tasks/task-detail"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {Calendar} from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible"
import {Avatar, AvatarFallback, AvatarImage} from "@/components/ui/avatar"
import {useToast} from "@/hooks/use-toast"
import {format} from "date-fns"
import {vi} from "date-fns/locale"
import {TASK_STATUS_OPTIONS} from "@/helpers/constants.js";
import CustomSelect from "@/components/ui-custom/custom-select/index.jsx";
import {CustomPageTitle} from "@/components/ui-custom/custom-page-title/index.jsx";
import {DeleteTaskConfirm} from "@/components/tasks/delete-task-confirm"
import {UserSelect} from "@/components/ui-custom/user-select/index.jsx";
import {cn} from "@/lib/utils"
import useTaskListQuery from "@/queries/useTaskListQuery.js";

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
    assigned_to: {id: 1, name: "Nguyễn Văn A", avatar: null},
    status: TASK_STATUS.PENDING,
    due_date: "2024-02-21",
    priority: "high",
    created_by: {id: 1, name: "Admin"},
    created_at: "2024-02-20T08:00:00Z",
    updated_at: "2024-02-20T08:00:00Z"
  },
  {
    id: 2,
    title: "Chụp ảnh cưới cho khách hàng Trần Thị B",
    description: "Buổi chụp tại studio",
    assigned_to: {id: 2, name: "Trần Văn B", avatar: null},
    status: TASK_STATUS.IN_PROGRESS,
    due_date: "2024-02-22",
    priority: "medium",
    created_by: {id: 1, name: "Admin"},
    created_at: "2024-02-20T09:00:00Z",
    updated_at: "2024-02-20T09:00:00Z"
  },
  {
    id: 3,
    title: "Sửa váy cưới mã VC002",
    description: "Chỉnh sửa theo yêu cầu khách hàng",
    assigned_to: {id: 3, name: "Lê Thị C", avatar: null},
    status: TASK_STATUS.COMPLETED,
    due_date: "2024-02-20",
    priority: "low",
    created_by: {id: 1, name: "Admin"},
    created_at: "2024-02-19T08:00:00Z",
    updated_at: "2024-02-20T10:00:00Z"
  }
]

const TaskListPage = () => {
  const {toast} = useToast()
  const [isCreateOpen, setIsCreateOpen] = useState(false)
  const [isDetailOpen, setIsDetailOpen] = useState(false)
  const [selectedTask, setSelectedTask] = useState(null)
  const [isPendingOpen, setIsPendingOpen] = useState(true)
  const [isInProgressOpen, setIsInProgressOpen] = useState(true)
  const [isCompletedOpen, setIsCompletedOpen] = useState(true)

  // Filters
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedEmployee, setSelectedEmployee] = useState("all")
  const [selectedDate, setSelectedDate] = useState(new Date())
  const [selectedStatus, setSelectedStatus] = useState(TASK_STATUS.ALL)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)

  const {data, isPending} = useTaskListQuery({
    search: searchTerm,
    assigned_to: selectedEmployee === 'all' ? undefined : selectedEmployee,
    created_at: selectedDate,
    status: selectedStatus === 'all' ? undefined : selectedStatus
  })
  console.log('data', data)
  // Group tasks by status
  const groupedTasks = data?.data?.data?.data?.reduce((acc, task) => {
        if (!acc[task.status]) {
          acc[task.status] = [];
        }
        acc[task.status].push(task);
        return acc;
      }, {})
      ??
      {
        'pending': [],
        'in_progress': [],
        'completed': []
      }
  ;

  const handleDelete = async (taskId) => {
    try {
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
    }
  }

  const handleStatusChange = async (taskId, newStatus) => {
    try {
      // API call here
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
      setSelectedTask(null)
    }
  }

  const handleEditClick = (e, task) => {
    e.stopPropagation()
    setSelectedTask(task)
    setIsCreateOpen(true)
  }

  const handleDeleteClick = (e, task) => {
    e.stopPropagation()
    setSelectedTask(task)
    setShowDeleteDialog(true)
  }

  const renderStatusSection = (status, isOpen, setIsOpen, title) => {
    const tasks = groupedTasks[status] || [];
    if (!tasks.length) return null;

    return (
      <Collapsible
        open={isOpen}
        onOpenChange={setIsOpen}
        className="space-y-2"
      >
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">
            {title} ({tasks.length})
          </h3>
          <CollapsibleTrigger asChild>
            <Button variant="ghost" size="sm" className="w-9 p-0">
              <ChevronDown
                className={cn(
                  "h-4 w-4 transition-transform duration-200",
                  isOpen ? "rotate-180" : ""
                )}
              />
              <span className="sr-only">Toggle</span>
            </Button>
          </CollapsibleTrigger>
        </div>
        <CollapsibleContent>
          <div className="flex flex-col gap-4">
            {Array.from({length: Math.ceil(tasks.length / 3)}).map((_, rowIndex) => (
              <div
                key={rowIndex}
                className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4"
              >
                {tasks.slice(rowIndex * 3, (rowIndex + 1) * 3).map((task) => (
                  <div
                    key={task.id}
                    className="bg-card rounded-lg border p-4 space-y-4 cursor-pointer hover:border-primary/50 transition-colors"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailOpen(true);
                    }}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="font-medium">{task.title}</span>
                      </div>
                    </div>

                    <p className="text-sm text-left text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4"/>
                        <span className="text-xs">
                          {format(new Date(task.due_date), 'dd/MM/yyyy', {locale: vi})}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.user_name}/>
                          <AvatarFallback>{task.user_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.user_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </CollapsibleContent>
      </Collapsible>
    );
  };

  const renderMobileView = () => {
    return (
      <div className="grid gap-8 lg:hidden">
        {renderStatusSection(
          'pending',
          isPendingOpen,
          setIsPendingOpen,
          'Chờ xử lý'
        )}
        {renderStatusSection(
          'in_progress',
          isInProgressOpen,
          setIsInProgressOpen,
          'Đang thực hiện'
        )}
        {renderStatusSection(
          'completed',
          isCompletedOpen,
          setIsCompletedOpen,
          'Hoàn thành'
        )}
      </div>
    );
  };

  const renderDesktopView = () => {
    return (
      <div className="hidden lg:grid lg:grid-cols-3 lg:gap-6">
        {[TASK_STATUS.PENDING, TASK_STATUS.IN_PROGRESS, TASK_STATUS.COMPLETED].map((status) => (
          <div key={status} className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="font-semibold text-lg">{STATUS_LABELS[status]}</h2>
              <span className="bg-muted text-muted-foreground px-2 py-1 rounded-md text-sm">
                {data?.data?.data?.data?.filter(t => t.status === status).length}
              </span>
            </div>

            <div className="space-y-3">
              {data?.data?.data?.data?.filter(task => task.status === status)
                .map(task => (
                  <div
                    key={task.id}
                    className="bg-card p-4 rounded-lg border shadow-sm hover:shadow-md transition-shadow cursor-pointer"
                    onClick={() => {
                      setSelectedTask(task);
                      setIsDetailOpen(true);
                    }}
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
                          <Edit className="h-4 w-4"/>
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 hover:text-destructive"
                          onClick={(e) => handleDeleteClick(e, task)}
                        >
                          <Trash2 className="h-4 w-4"/>
                        </Button>
                      </div>
                    </div>

                    <p className="text-sm text-left text-muted-foreground line-clamp-2 mb-3">
                      {task.description}
                    </p>

                    <div className="flex items-center justify-between mt-3 pt-3 border-t">
                      <div className="flex items-center gap-1 text-muted-foreground">
                        <CalendarIcon className="h-4 w-4"/>
                        <span className="text-xs">
                          {format(new Date(task.due_date), 'dd/MM/yyyy', {locale: vi})}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <Avatar className="h-6 w-6">
                          <AvatarImage src={task.user_name}/>
                          <AvatarFallback>{task.user_name.charAt(0)}</AvatarFallback>
                        </Avatar>
                        <span className="text-sm">{task.user_name}</span>
                      </div>
                    </div>
                  </div>
                ))}
            </div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <CustomPageTitle title={'Công việc'} icon={<FolderKanban className="h-6 w-6 text-primary"/>}/>
        <Button onClick={() => setIsCreateOpen(true)}>
          <Plus className="mr-2 h-4 w-4"/> Thêm công việc
        </Button>
      </div>

      {/* Filters */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Input
          placeholder="Tìm kiếm..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        <UserSelect
          value={selectedEmployee}
          onValueChange={setSelectedEmployee}
        />

        <Popover>
          <PopoverTrigger asChild>
            <Button
              variant={"outline"}
              className={cn(
                "w-full justify-start text-left font-normal",
                !selectedDate && "text-muted-foreground"
              )}
            >
              <CalendarIcon className="mr-2 h-4 w-4"/>
              {selectedDate ? (
                format(selectedDate, "PPP", {locale: vi})
              ) : (
                <span>Chọn ngày</span>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0" align="start">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={setSelectedDate}
              initialFocus
              locale={vi}
            />
          </PopoverContent>
        </Popover>

        <CustomSelect
          value={selectedStatus}
          onValueChange={setSelectedStatus}
          triggerName="Chọn trạng thái"
          options={TASK_STATUS_OPTIONS}
        />
      </div>

      {/* Responsive Views */}
      {renderMobileView()}
      {renderDesktopView()}

      {!data?.data?.data?.data?.length && (
        <p className="text-muted-foreground text-center">
          Không có công việc nào
        </p>
      )}

      {/* Dialogs */}
      <Dialog open={isCreateOpen} onOpenChange={setIsCreateOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>
              {selectedTask ? "Chỉnh sửa công việc" : "Tạo công việc mới"}
            </DialogTitle>
          </DialogHeader>
          <TaskForm
            task={selectedTask}
            setSelectedTask={setSelectedTask}
            onClose={() => setIsCreateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <Dialog open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <TaskDetail
            task={selectedTask}
            onStatusChange={handleStatusChange}
            setIsDetailOpen={setIsDetailOpen}
          />
        </DialogContent>
      </Dialog>

      <DeleteTaskConfirm
        showDeleteDialog={showDeleteDialog}
        setShowDeleteDialog={setShowDeleteDialog}
        selectedTask={selectedTask}
        setSelectedTask={setSelectedTask}
        onDelete={handleDelete}
      />
    </div>
  )
}

export default TaskListPage 