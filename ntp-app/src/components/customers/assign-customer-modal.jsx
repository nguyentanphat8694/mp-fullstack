import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { useState } from "react";

const AssignCustomerModal = ({ 
  customer, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading,
  staffList = [] 
}) => {
  const [selectedStaff, setSelectedStaff] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ customerId: customer.id, staffId: selectedStaff })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Phân công khách hàng</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Khách hàng</Label>
            <p className="text-sm font-medium">{customer?.name}</p>
          </div>
          <div className="space-y-2">
            <Label>Trạng thái hiện tại</Label>
            <p className="text-sm font-medium capitalize">{customer?.status}</p>
          </div>
          <div className="space-y-2">
            <Label htmlFor="staff">Nhân viên phụ trách</Label>
            <Select 
              value={selectedStaff} 
              onValueChange={setSelectedStaff}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn nhân viên" />
              </SelectTrigger>
              <SelectContent>
                {staffList.map((staff) => (
                  <SelectItem key={staff.id} value={staff.id}>
                    {staff.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <DialogFooter>
            <Button 
              type="button" 
              variant="outline" 
              onClick={onClose}
            >
              Hủy
            </Button>
            <Button 
              type="submit"
              disabled={isLoading || !selectedStaff}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AssignCustomerModal } 