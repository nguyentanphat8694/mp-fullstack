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
import {useCallback, useState} from "react"
import {REWARD_TYPE_OPTIONS} from "@/helpers/constants.js";
import CustomSelect from "@/components/ui-custom/custom-select/index.jsx";
import PropTypes from "prop-types";

const AddRewardModal = ({ employee, setIsRewardOpen, isRewardOpen }) => {
  const [type, setType] = useState("")
  const [amount, setAmount] = useState("")
  const [reason, setReason] = useState("")
  const isPending = false;

  const handleSubmit = (e) => {
    e.preventDefault()
  }

  const onClose = useCallback(() => setIsRewardOpen && setIsRewardOpen(false), []);

  return (
    <Dialog open={isRewardOpen} onOpenChange={onClose}>
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
            <CustomSelect
              className="w-[180px]"
              value={type}
              onValueChange={setType}
              triggerName="Chọn loại"
              options={REWARD_TYPE_OPTIONS}
            />
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
              disabled={isPending || !type || !amount}
            >
              {isPending ? "Đang xử lý..." : "Xác nhận"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export { AddRewardModal }

AddRewardModal.propTypes = {
  employee: PropTypes.object,
  setIsRewardOpen: PropTypes.func,
  isRewardOpen: PropTypes.bool,
}