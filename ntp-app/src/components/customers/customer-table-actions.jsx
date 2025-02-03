import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip.jsx";
import {Button} from "@/components/ui/button.jsx";
import {Calendar, Edit, Eye, MoreVertical, Trash2, UserPlus} from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu.jsx";
import PropTypes from "prop-types";
import {useNavigate} from "react-router-dom";

export const ActionButtons = ({customer, setSelectedCustomer, setIsAssignModalOpen, setIsDeleteDialogOpen, setIsAppointmentModalOpen, onEdit}) => {
  const navigate = useNavigate();
  return (
    <>
      {/*Desktop view*/}
      <div className="hidden sm:flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/customers/${customer.id}`)}
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
                onClick={() => onEdit(customer)}
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
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsAssignModalOpen(true);
                }}
              >
                <UserPlus className="h-4 w-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Phân công</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                className="text-destructive"
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsDeleteDialogOpen(true);
                }}
              >
                <Trash2 className="h-4 w-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Xóa</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>

        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => {
                  setSelectedCustomer(customer);
                  setIsAppointmentModalOpen(true);
                }}
              >
                <Calendar className="h-4 w-4"/>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm lịch hẹn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>

      {/*Mobile view*/}
      <div className="sm:hidden flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4"/>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              <Eye className="h-4 w-4 mr-2"/>
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(customer)}>
              <Edit className="h-4 w-4 mr-2"/>
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCustomer(customer);
                setIsAssignModalOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-2"/>
              Phân công
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCustomer(customer);
                setIsAppointmentModalOpen(true);
              }}
              className="text-primary"
            >
              <Calendar className="h-4 w-4 mr-2"/>
              Thêm lịch hẹn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCustomer(customer);
                setIsDeleteDialogOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2"/>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

ActionButtons.propTypes = {
  customer: PropTypes.object,
  setSelectedCustomer: PropTypes.func,
  setIsAssignModalOpen: PropTypes.func,
  setIsAppointmentModalOpen: PropTypes.func,
  setIsDeleteDialogOpen: PropTypes.func,
  onEdit: PropTypes.func,
}