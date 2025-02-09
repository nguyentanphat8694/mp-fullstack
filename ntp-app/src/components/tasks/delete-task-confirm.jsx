import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle
} from "@/components/ui/alert-dialog";
import {useCallback} from "react";
import PropTypes from "prop-types";
import {useToast} from "@/hooks/use-toast";
import useTaskDeleteMutate from "@/queries/useTaskDeleteMutate";

export const DeleteTaskConfirm = ({
  showDeleteDialog,
  setShowDeleteDialog,
  selectedTask,
  setSelectedTask,
}) => {
  const {toast} = useToast();

  const onSuccess = useCallback(() => {
    toast({
      title: "Thành công",
      description: "Xóa công việc thành công",
    });
    setShowDeleteDialog(false);
    setSelectedTask(null);
  }, []);

  const deleteMutation = useTaskDeleteMutate(onSuccess);

  const handleDelete = useCallback(async () => {
    try {
      await deleteMutation.mutateAsync(selectedTask.id);
    } catch (error) {
      console.error(error);
      toast({
        variant: "destructive",
        title: "Lỗi",
        description: "Đã có lỗi xảy ra. Vui lòng thử lại sau.",
      });
    }
  }, [selectedTask?.id]);

  return (
    <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
          <AlertDialogDescription>
            Bạn có chắc chắn muốn xóa công việc "{selectedTask?.title}"?
            Hành động này không thể hoàn tác.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={() => {
            setShowDeleteDialog(false);
            setSelectedTask(null);
          }}>
            Hủy
          </AlertDialogCancel>
          <AlertDialogAction 
            className="bg-destructive text-destructive-foreground" 
            onClick={handleDelete}
          >
            Xóa
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
};

DeleteTaskConfirm.propTypes = {
  showDeleteDialog: PropTypes.bool,
  setShowDeleteDialog: PropTypes.func,
  selectedTask: PropTypes.object,
  setSelectedTask: PropTypes.func,
}; 