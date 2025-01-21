import { useState } from "react"
import { format } from "date-fns"
import { vi } from "date-fns/locale"
import { Calendar } from "@/components/ui/calendar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { CheckCircle, XCircle } from "lucide-react"

export const CheckAvailableModal = ({ 
  isOpen, 
  onClose,
  productId,
  productName 
}) => {
  const [startDate, setStartDate] = useState(null)
  const [endDate, setEndDate] = useState(null)
  const [isChecking, setIsChecking] = useState(false)
  const [checkResult, setCheckResult] = useState(null)

  const handleCheck = async () => {
    setIsChecking(true)
    // Mock API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // Mock data - switch between available and not available for testing
    const isAvailable = productId % 2 === 0
    
    const mockConflicts = [
      {
        id: 1,
        customer_name: "Nguyễn Văn A",
        rental_start: "2024-03-25",
        rental_end: "2024-03-27"
      },
      {
        id: 2,
        customer_name: "Trần Thị B",
        rental_start: "2024-04-01",
        rental_end: "2024-04-03"
      }
    ]
    
    setCheckResult({
      isAvailable,
      conflicts: isAvailable ? [] : mockConflicts
    })
    setIsChecking(false)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Kiểm tra tình trạng cho thuê</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div>
            <Label>Sản phẩm</Label>
            <p className="text-sm text-muted-foreground">{productName}</p>
          </div>

          <div className="grid gap-6 md:grid-cols-2">
            <div className="space-y-2">
              <Label>Ngày bắt đầu</Label>
              <Calendar
                mode="single"
                selected={startDate}
                onSelect={setStartDate}
                locale={vi}
                disabled={(date) => date < new Date()}
              />
            </div>
            <div className="space-y-2">
              <Label>Ngày kết thúc</Label>
              <Calendar
                mode="single"
                selected={endDate}
                onSelect={setEndDate}
                locale={vi}
                disabled={(date) => !startDate || date < startDate}
              />
            </div>
          </div>

          {checkResult && (
            <Alert variant={checkResult.isAvailable ? "default" : "destructive"}>
              <AlertDescription className="flex items-center gap-2">
                {checkResult.isAvailable ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Sản phẩm có sẵn trong khoảng thời gian này</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4" />
                    <span>Sản phẩm đã được đặt trong các ngày:</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {checkResult && !checkResult.isAvailable && (
            <div className="space-y-2">
              {checkResult.conflicts.map((conflict) => (
                <div 
                  key={conflict.id}
                  className="rounded-lg border p-3 text-sm"
                >
                  <p className="font-medium">{conflict.customer_name}</p>
                  <p className="text-muted-foreground">
                    {format(new Date(conflict.rental_start), 'dd/MM/yyyy')} - {format(new Date(conflict.rental_end), 'dd/MM/yyyy')}
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-end gap-4">
            <Button variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button 
              onClick={handleCheck}
              disabled={!startDate || !endDate || isChecking}
            >
              {isChecking ? "Đang kiểm tra..." : "Kiểm tra"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
} 