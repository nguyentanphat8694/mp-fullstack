import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { 
  Clock, 
  Calendar,
  User,
  MessageSquare,
  AlertCircle,
  CheckCircle2,
  Timer,
  ArrowRight
} from "lucide-react"

const STATUS_COLORS = {
  pending: "default",
  in_progress: "warning",
  completed: "success"
}

const STATUS_LABELS = {
  pending: "Chờ xử lý",
  in_progress: "Đang thực hiện",
  completed: "Hoàn thành"
}

const PRIORITY_COLORS = {
  low: "bg-slate-100 text-slate-700",
  medium: "bg-blue-100 text-blue-700",
  high: "bg-rose-100 text-rose-700"
}

const TaskDetail = ({ task, onStatusChange, onClose }) => {
  const { toast } = useToast()
  const [comment, setComment] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [comments, setComments] = useState([
    {
      id: 1,
      task_id: task.id,
      comment: "Tôi sẽ kiểm tra và báo cáo trong hôm nay",
      created_by: { id: 1, name: "Nguyễn Văn A", avatar: null },
      created_at: "2024-02-20T09:00:00Z"
    },
    {
      id: 2,
      task_id: task.id,
      comment: "Đã kiểm tra xong, cần sửa một số chi tiết",
      created_by: { id: 1, name: "Nguyễn Văn A", avatar: null },
      created_at: "2024-02-20T11:00:00Z"
    }
  ])

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

  return (
    <div className="space-y-6 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">{task.title}</h2>
          <div className="flex items-center gap-2">
            <span className={`text-xs px-2 py-1 rounded-full ${PRIORITY_COLORS[task.priority]}`}>
              {task.priority === 'high' ? 'Cao' : task.priority === 'medium' ? 'Trung bình' : 'Thấp'}
            </span>
            <Badge variant={STATUS_COLORS[task.status]}>
              {STATUS_LABELS[task.status]}
            </Badge>
          </div>
        </div>
        
        <p className="text-muted-foreground">{task.description}</p>

        <div className="grid grid-cols-2 gap-4 bg-muted/50 p-4 rounded-lg">
          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <User className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Người thực hiện</p>
              <div className="flex items-center gap-2">
                <Avatar className="h-6 w-6">
                  <AvatarImage src={task.assigned_to.avatar} />
                  <AvatarFallback>{task.assigned_to.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <p className="font-medium">{task.assigned_to.name}</p>
              </div>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <div className="h-10 w-10 rounded-full bg-primary/10 flex items-center justify-center">
              <Clock className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Hạn hoàn thành</p>
              <p className="font-medium">
                {format(new Date(task.due_date), 'dd/MM/yyyy', { locale: vi })}
              </p>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {task.status === 'pending' && (
            <Button 
              className="w-full"
              onClick={() => onStatusChange(task.id, 'in_progress')}
            >
              <Timer className="mr-2 h-4 w-4" />
              Bắt đầu thực hiện
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button 
              className="w-full"
              onClick={() => onStatusChange(task.id, 'completed')}
            >
              <CheckCircle2 className="mr-2 h-4 w-4" />
              Hoàn thành
            </Button>
          )}
        </div>
      </div>

      <Separator />

      <div className="flex-1 overflow-hidden flex flex-col">
        <h3 className="font-semibold flex items-center gap-2 mb-4">
          <MessageSquare className="h-4 w-4" />
          Bình luận
        </h3>

        <ScrollArea className="flex-1 pr-4 -mr-4">
          <div className="space-y-4">
            {comments.map((item) => (
              <div key={item.id} className="flex gap-4">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={item.created_by.avatar} />
                  <AvatarFallback>{item.created_by.name.charAt(0)}</AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.created_by.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.created_at), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{item.comment}</p>
                </div>
              </div>
            ))}
          </div>
        </ScrollArea>

        <div className="mt-4 flex gap-2">
          <Textarea
            placeholder="Thêm bình luận..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            className="min-h-[80px]"
          />
          <Button 
            size="icon"
            disabled={isLoading || !comment.trim()}
            onClick={handleComment}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

export { TaskDetail } 