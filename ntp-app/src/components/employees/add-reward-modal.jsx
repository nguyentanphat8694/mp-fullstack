import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useState } from "react"

const AddRewardModal = ({ 
  employee, 
  isOpen, 
  onClose, 
  onSubmit, 
  isLoading 
}) => {
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")

  const handleSubmit = (e) => {
    e.preventDefault()
    onSubmit({ 
      employeeId: employee.id, 
      type,
      amount: parseFloat(amount),
      reason
    })
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Thêm thưởng/phạt</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label>Nhân viên</Label>
            <p className="text-sm font-medium">{employee?.name}</p>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="type">Loại</Label>
            <Select 
              value={type} 
              onValueChange={setType}
              required
            >
              <SelectTrigger>
                <SelectValue placeholder="Chọn loại" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="reward">Thưởng</SelectItem>
                <SelectItem value="penalty">Phạt</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="amount">Số tiền</Label>
            <Input
              id="amount"
              type="number"
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              required
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="reason">Lý do</Label>
            <Textarea
              id="reason"
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Nhập lý do thưởng/phạt..."
              required
            />
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
              disabled={isLoading || !type || !amount}
            >
              {isLoading ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AddRewardModal } 