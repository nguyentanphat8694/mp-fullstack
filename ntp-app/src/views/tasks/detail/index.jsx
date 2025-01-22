import { useState, useEffect } from "react"
import { useParams } from "react-router-dom"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { TaskForm } from "@/components/tasks/task-form"
import { TaskTimeline } from "@/components/tasks/task-timeline"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { Clock, Calendar, AlertCircle } from "lucide-react"

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

const TaskDetailPage = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const [task, setTask] = useState(null)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [comment, setComment] = useState("")

  useEffect(() => {
    const fetchTask = async () => {
      try {
        // Mock data
        setTask({
          id: parseInt(id),
          title: "Kiểm tra váy cưới mã VC001",
          description: "Kiểm tra tình trạng váy sau khi khách trả",
          assignee: { id: 1, name: "Nguyễn Văn A", avatar: null },
          startDate: "2024-02-20",
          dueDate: "2024-02-21",
          status: "pending",
          priority: "high",
          history: [
            {
              user: { name: "Admin", avatar: null },
              timestamp: "2024-02-20T08:00:00Z",
              action: "đã tạo công việc"
            },
            {
              user: { name: "Nguyễn Văn A", avatar: null },
              timestamp: "2024-02-20T09:00:00Z",
              action: "đã bắt đầu thực hiện",
              comment: "Tôi sẽ kiểm tra và báo cáo trong hôm nay"
            }
          ]
        })
      } catch (error) {
        console.error("Error fetching task:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin công việc",
          variant: "destructive"
        })
      }
    }

    fetchTask()
  }, [id, toast])

  const handleEdit = async (data) => {
    try {
      setIsLoading(true)
      // API call here
      console.log("Updating task:", data)
      
      toast({
        title: "Thành công",
        description: "Đã cập nhật công việc"
      })
      setIsEditOpen(false)
    } catch (error) {
      console.error("Error updating task:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật công việc",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleComment = async () => {
    if (!comment.trim()) return

    try {
      setIsLoading(true)
      // API call here
      console.log("Adding comment:", comment)
      
      toast({
        title: "Thành công",
        description: "Đã thêm bình luận"
      })
      setComment("")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm bình luận",
        variant: "destructive"
      })
    } finally {
      setIsLoading(false)
    }
  }

  if (!task) return null

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{task.title}</h1>
          <div className="flex items-center gap-2 mt-2">
            <Badge variant={statusColors[task.status]}>
              {statusLabels[task.status]}
            </Badge>
            <Badge variant="outline">{task.priority}</Badge>
          </div>
        </div>
        <Button onClick={() => setIsEditOpen(true)}>
          Chỉnh sửa
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <Tabs defaultValue="details" className="space-y-4">
            <TabsList>
              <TabsTrigger value="details">Chi tiết</TabsTrigger>
              <TabsTrigger value="history">Lịch sử</TabsTrigger>
            </TabsList>

            <TabsContent value="details" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Mô tả công việc</CardTitle>
                </CardHeader>
                <CardContent>
                  <p>{task.description}</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Bình luận</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex gap-4">
                    <Textarea
                      placeholder="Thêm bình luận..."
                      value={comment}
                      onChange={(e) => setComment(e.target.value)}
                    />
                    <Button 
                      onClick={handleComment}
                      disabled={isLoading || !comment.trim()}
                    >
                      Gửi
                    </Button>
                  </div>
                  <TaskTimeline history={task.history} />
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="history">
              <Card>
                <CardContent className="pt-6">
                  <TaskTimeline history={task.history} />
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Người thực hiện</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-3">
                <Avatar>
                  <AvatarImage src={task.assignee.avatar} />
                  <AvatarFallback>{task.assignee.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <span className="font-medium">{task.assignee.name}</span>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Thời gian</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center gap-3">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Ngày bắt đầu</p>
                  <p className="font-medium">
                    {format(new Date(task.startDate), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Clock className="h-4 w-4 text-muted-foreground" />
                <div>
                  <p className="text-sm text-muted-foreground">Hạn hoàn thành</p>
                  <p className="font-medium">
                    {format(new Date(task.dueDate), 'dd/MM/yyyy', { locale: vi })}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa công việc</DialogTitle>
          </DialogHeader>
          <TaskForm
            task={task}
            employees={[
              { id: 1, name: "Nguyễn Văn A" },
              { id: 2, name: "Trần Thị B" },
              // ... more employees
            ]}
            onSubmit={handleEdit}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  )
}

export default TaskDetailPage 