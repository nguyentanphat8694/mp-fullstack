import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Award, Edit, Eye, Trash2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { EmployeeUpdateForm } from "./employee-update-form";

export const EmployeeTableActions = ({
  employee,
  setSelectedEmployee,
  setIsDeleteDialogOpen,
  setIsRewardOpen,
}) => {
  const navigate = useNavigate();
  const [isUpdateOpen, setIsUpdateOpen] = useState(false);

  const onViewDetails = useCallback(() => navigate(`/employees/${employee.id}`), [employee]);
  
  const onDelete = useCallback(() => {
    setSelectedEmployee && setSelectedEmployee(employee)
    setIsDeleteDialogOpen && setIsDeleteDialogOpen(true)
  }, [employee]);
  
  const onReward = useCallback(() => {
    setSelectedEmployee && setSelectedEmployee(employee);
    setIsRewardOpen && setIsRewardOpen(true);
  }, [employee]);

  return (
    <div className="flex justify-end gap-2">
      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onViewDetails}
            >
              <Eye className="h-4 w-4"/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chi tiết</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <Dialog open={isUpdateOpen} onOpenChange={setIsUpdateOpen}>
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsUpdateOpen(true)}
              >
                <Edit className="h-4 w-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Chỉnh sửa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <EmployeeUpdateForm 
            employee={employee}
            onClose={() => setIsUpdateOpen(false)}
          />
        </DialogContent>
      </Dialog>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onReward}
            >
              <Award className="h-4 w-4" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thưởng/Phạt</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>

      <TooltipProvider>
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              onClick={onDelete}
            >
              <Trash2 className="h-4 w-4"/>
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Xóa</p>
          </TooltipContent>
        </Tooltip>
      </TooltipProvider>
    </div>
  )
}

EmployeeTableActions.propTypes = {
  employee: PropTypes.object,
  setSelectedEmployee: PropTypes.func,
  setIsDeleteDialogOpen: PropTypes.func,
  setIsRewardOpen: PropTypes.func,
}