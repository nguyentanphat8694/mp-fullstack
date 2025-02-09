import {Tooltip, TooltipContent, TooltipProvider, TooltipTrigger} from "@/components/ui/tooltip"
import {Button} from "@/components/ui/button"
import {Edit, Eye, MoreVertical} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu"
import PropTypes from "prop-types"
import { useNavigate } from "react-router-dom"
import { PATHS } from "@/helpers/paths"

export const ContractTableActions = ({contract}) => {
  const navigate = useNavigate();

  const handleView = () => {
    navigate(PATHS.CONTRACTS.DETAIL.replace(':id', contract.id));
  };

  const handleEdit = () => {
    navigate(PATHS.CONTRACTS.EDIT.replace(':id', contract.id));
  };

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
                onClick={handleView}
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
            <DropdownMenuItem onClick={handleView}>
              <Eye className="h-4 w-4 mr-2"/>
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2"/>
              Chỉnh sửa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );
};

ContractTableActions.propTypes = {
  contract: PropTypes.object.isRequired
}; 