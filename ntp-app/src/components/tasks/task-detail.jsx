import {useCallback, useState} from "react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Separator } from "@/components/ui/separator"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { useToast } from "@/hooks/use-toast"
import { 
  Clock, 
  User,
  MessageSquare,
  CheckCircle2,
  Timer,
  ArrowRight
} from "lucide-react"
import PropTypes from "prop-types";
import useTaskCommentMutate from "@/queries/useTaskCommentMutate"
import useTaskUpdateStatus from "@/queries/useTaskUpdateStatus"
import {UpdateStatusConfirm} from "./update-status-confirm"
// import useTaskDetailQuery from "@/queries/useTaskDetailQuery"


const TaskDetail = ({ taskId }) => {
  const { toast } = useToast()
  const [comment, setComment] = useState("")
  const [showStatusDialog, setShowStatusDialog] = useState(false)

  // Integration code
  // const { data: taskData, isPending } = useTaskDetailQuery(taskId);
  // const task = taskData?.data;
  
  // if (isPending) {
  //   return <div>Loading...</div>;
  // }

  // Mock data for testing UI
  const task = {
    title: "Kiểm tra váy cưới mã VC001",
    description: "Kiểm tra tình trạng váy sau khi khách trả",
    assigned_to: {
      id: 1,
      name: "Nguyễn Văn A"
    },
    status: 'pending',
    due_date: "2024-03-25T09:00:00",
    comments: [
      {
        name: "Nguyễn Văn A",
        createdDate: "2024-02-20T09:00:00",
        content: "Tôi sẽ kiểm tra và báo cáo trong hôm nay"
      },
      {
        name: "Nguyễn Văn A",
        createdDate: "2024-02-20T11:00:00",
        content: "Đã kiểm tra xong, cần sửa một số chi tiết"
      }
    ]
  };

  const onCommentSuccess = useCallback(() => {
    toast({
      title: "Thành công",
      description: "Đã thêm bình luận"
    });
    setComment("");
  }, []);

  const onStatusSuccess = useCallback((newStatus) => {
    toast({
      title: "Thành công",
      description: `Đã chuyển trạng thái sang ${newStatus === 'in_progress' ? 'đang thực hiện' : 'hoàn thành'}`
    });
    setShowStatusDialog(false);
  }, []);

  const commentMutation = useTaskCommentMutate(taskId, onCommentSuccess);
  const statusMutation = useTaskUpdateStatus(taskId, onStatusSuccess);

  const handleComment = async () => {
    if (!comment.trim()) return;

    try {
      await commentMutation.mutateAsync({
        id_user: 1, // TODO: Get from auth context
        comment: comment.trim()
      });
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể thêm bình luận",
      });
    }
  };

  const handleUpdateStatus = useCallback(async () => {
    try {
      const newStatus = task.status === 'pending' ? 'in_progress' : 'completed';
      await statusMutation.mutateAsync(newStatus);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Không thể cập nhật trạng thái",
      });
    }
  }, [task?.status]);

  return (
    <div className="space-y-6 max-h-[80vh] overflow-hidden flex flex-col">
      <div className="space-y-4">
        <div className="flex flex-col gap-2 items-center justify-between">
          <h2 className="text-2xl font-bold">{task.title}</h2>
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
              onClick={() => setShowStatusDialog(true)}
            >
              <Timer className="mr-2 h-4 w-4" />
              Bắt đầu thực hiện
            </Button>
          )}
          {task.status === 'in_progress' && (
            <Button 
              className="w-full"
              onClick={() => setShowStatusDialog(true)}
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
            {task.comments.map((item, index) => (
              <div key={index} className="flex gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-medium">{item.name}</span>
                    <span className="text-xs text-muted-foreground">
                      {format(new Date(item.createdDate), 'HH:mm dd/MM/yyyy', { locale: vi })}
                    </span>
                  </div>
                  <p className="mt-1 text-sm">{item.content}</p>
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
            disabled={commentMutation.isPending || !comment.trim()}
            onClick={handleComment}
          >
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      <UpdateStatusConfirm
        showDialog={showStatusDialog}
        setShowDialog={setShowStatusDialog}
        currentStatus={task?.status}
        onConfirm={handleUpdateStatus}
        isPending={statusMutation.isPending}
      />
    </div>
  );
};

TaskDetail.propTypes = {
  taskId: PropTypes.number
};

export { TaskDetail };