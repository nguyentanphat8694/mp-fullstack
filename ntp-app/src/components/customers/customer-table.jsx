import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Eye,
  Edit,
  UserPlus,
  Trash2,
  Calendar,
  MoreVertical,
} from "lucide-react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { AssignCustomerModal } from "./assign-customer-modal";
import { AddAppointmentModal } from "./add-appointment-modal";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const CustomerTable = ({
  customers = [],
  onEdit,
  onAssign,
  onDelete,
  onAddAppointment,
  staffList = [],
}) => {
  const navigate = useNavigate();
  const [sourceFilter, setSourceFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);

  const filteredCustomers = customers.filter((customer) => {
    if (sourceFilter !== "all" && customer.source !== sourceFilter)
      return false;
    if (statusFilter !== "all" && customer.status !== statusFilter)
      return false;
    if (
      searchQuery &&
      !customer.name.toLowerCase().includes(searchQuery.toLowerCase())
    )
      return false;
    return true;
  });

  const handleAssign = async (data) => {
    try {
      setIsLoading(true);
      await onAssign(data);
      setIsAssignModalOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error assigning customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setIsLoading(true);
      await onDelete(selectedCustomer.id);
      setIsDeleteDialogOpen(false);
      setSelectedCustomer(null);
    } catch (error) {
      console.error("Error deleting customer:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const ActionButtons = ({ customer }) => {
    // Desktop view
    const DesktopActions = () => (
      <div className="hidden sm:flex justify-end gap-2">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate(`/customers/${customer.id}`)}
              >
                <Eye className="h-4 w-4" />
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
                <Edit className="h-4 w-4" />
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
                <UserPlus className="h-4 w-4" />
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
                <Trash2 className="h-4 w-4" />
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
                <Calendar className="h-4 w-4" />
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Thêm lịch hẹn</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </div>
    );

    // Mobile view
    const MobileActions = () => (
      <div className="sm:hidden flex justify-end">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="icon">
              <MoreVertical className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem
              onClick={() => navigate(`/customers/${customer.id}`)}
            >
              <Eye className="h-4 w-4 mr-2" />
              Chi tiết
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onEdit(customer)}>
              <Edit className="h-4 w-4 mr-2" />
              Chỉnh sửa
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCustomer(customer);
                setIsAssignModalOpen(true);
              }}
            >
              <UserPlus className="h-4 w-4 mr-2" />
              Phân công
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCustomer(customer);
                setIsAppointmentModalOpen(true);
              }}
              className="text-primary"
            >
              <Calendar className="h-4 w-4 mr-2" />
              Thêm lịch hẹn
            </DropdownMenuItem>
            <DropdownMenuItem
              onClick={() => {
                setSelectedCustomer(customer);
                setIsDeleteDialogOpen(true);
              }}
              className="text-destructive"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    );

    return (
      <>
        <DesktopActions />
        <MobileActions />
      </>
    );
  };

  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="hidden sm:table-cell">Nguồn</TableHead>
              <TableHead className="hidden sm:table-cell">Trạng thái</TableHead>
              <TableHead className="hidden sm:table-cell">
                Nhân viên phụ trách
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredCustomers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {customer.source}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {customer.status}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {customer.assigned_to}
                </TableCell>
                <TableCell>
                  <ActionButtons customer={customer} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssignCustomerModal
        customer={selectedCustomer}
        isOpen={isAssignModalOpen}
        onClose={() => {
          setIsAssignModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={handleAssign}
        isLoading={isLoading}
        staffList={staffList}
      />

      <AlertDialog
        open={isDeleteDialogOpen}
        onOpenChange={setIsDeleteDialogOpen}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Xác nhận xóa</AlertDialogTitle>
            <AlertDialogDescription>
              Bạn có chắc chắn muốn xóa khách hàng {selectedCustomer?.name}?
              Hành động này không thể hoàn tác.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel
              onClick={() => {
                setIsDeleteDialogOpen(false);
                setSelectedCustomer(null);
              }}
            >
              Hủy
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isLoading}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {isLoading ? "Đang xử lý..." : "Xóa"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AddAppointmentModal
        customer={selectedCustomer}
        isOpen={isAppointmentModalOpen}
        onClose={() => {
          setIsAppointmentModalOpen(false);
          setSelectedCustomer(null);
        }}
        onSubmit={onAddAppointment}
        isLoading={isLoading}
      />
    </div>
  );
};

export { CustomerTable };
