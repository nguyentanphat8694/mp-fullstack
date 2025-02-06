import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Award, Edit, Eye, Trash2} from "lucide-react";
import {useNavigate} from "react-router-dom";
import {useCallback} from "react";
import PropTypes from "prop-types";

export const EmployeeTableActions = ({
                                       employee,
                                       onEdit,
                                       setSelectedEmployee,
                                       setIsDeleteDialogOpen,
                                       setIsRewardOpen,
                                       isRewardOpen
                                     }) => {
  const navigate = useNavigate();
  const onViewDetails = useCallback(() => navigate(`/employees/${employee.id}`), [employee]);
  const handleEdit = useCallback(() => onEdit && onEdit(employee), [employee]);
  const onDelete = useCallback(() => {
    setSelectedEmployee && setSelectedEmployee(employee)
    setIsDeleteDialogOpen && setIsDeleteDialogOpen(true)
  }, [employee]);
  const onReward = useCallback(() => {
    setSelectedEmployee && setSelectedEmployee(employee);
    setIsRewardOpen && setIsRewardOpen(true);
  }, [employee]);
  return <div className="flex justify-end gap-2">
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

    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleEdit}
          >
            <Edit className="h-4 w-4"/>
          </Button>
        </TooltipTrigger>
        <TooltipContent>
          <p>Chỉnh sửa</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
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
}

EmployeeTableActions.propTypes = {
  employee: PropTypes.object,
  onEdit: PropTypes.func,
  setSelectedEmployee: PropTypes.func,
  setIsDeleteDialogOpen: PropTypes.func,
  setIsRewardOpen: PropTypes.func,
  isRewardOpen: PropTypes.bool,
}