import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { EmployeeForm } from "@/components/employees/employee-form"
import { AddRewardModal } from "@/components/employees/add-reward-modal"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { Award } from "lucide-react"
import {EmployeeDetailInfo} from "@/components/employees/employee-detail-info";
import {EmployeeDetailAttendance} from "@/components/employees/employee-detail-attendance";
import {EmployeeDetailReward} from "@/components/employees/employee-detail-reward";
import {EmployeeDetailSummary} from "@/components/employees/employee-detail-summary";


const EmployeeDetailPage = () => {
  const { id } = useParams()
  const { toast } = useToast()
  const [employee, setEmployee] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isEditOpen, setIsEditOpen] = useState(false)
  const [isRewardOpen, setIsRewardOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Mock employee data
        const mockEmployee = {
          id: parseInt(id),
          name: "Nguyễn Văn A",
          position: "Nhân viên tư vấn",
          phone: "0123456789",
          email: "nva@example.com",
          status: "active",
          join_date: "2024-01-01",
          rewards: [
            {
              id: 1,
              type: "bonus",
              amount: 1000000,
              date: "2024-02-15",
              reason: "Hoàn thành xuất sắc công việc"
            }
          ],
          penalties: [
            {
              id: 1,
              type: "late",
              amount: 100000,
              date: "2024-02-10",
              reason: "Đi làm muộn"
            }
          ]
        }
        setEmployee(mockEmployee)
      } catch (error) {
        console.error("Error fetching employee data:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải thông tin nhân viên",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [id, toast])

  const handleEdit = async (data) => {
    try {
      setIsSubmitting(true)
      // Mock API call
      setEmployee({ ...employee, ...data })
      toast({
        title: "Thành công",
        description: "Đã cập nhật thông tin nhân viên"
      })
      setIsEditOpen(false)
    } catch (error) {
      console.error("Error updating employee:", error)
      toast({
        title: "Lỗi",
        description: "Không thể cập nhật thông tin",
        variant: "destructive"
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  if (isLoading) return <div>Loading...</div>
  if (!employee) return <div>Không tìm thấy nhân viên</div>

  return (
    <div className="space-y-6">
      <div className="flex items-start justify-between">
        <div className="flex gap-4 items-center">
          <Avatar className="h-24 w-24">
            <AvatarImage src={employee?.avatar} />
            <AvatarFallback className="text-2xl">{employee?.name?.charAt(0)}</AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-2xl font-bold">{employee?.name}</h1>
            <p className="text-muted-foreground">{employee?.position}</p>
            <div className="flex gap-2 mt-2">
              <Badge variant={employee?.status === 'active' ? 'success' : 'secondary'}>
                {employee?.status === 'active' ? 'Đang làm việc' : 'Đã nghỉ việc'}
              </Badge>
              <Badge variant="outline">{employee?.role}</Badge>
            </div>
          </div>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setIsRewardOpen(true)}>
            <Award className="mr-2 h-4 w-4" />
            Thưởng/Phạt
          </Button>
          <Button onClick={() => setIsEditOpen(true)}>
            Chỉnh sửa
          </Button>
        </div>
      </div>

      <Tabs defaultValue="info" className="space-y-4">
        <TabsList>
          <TabsTrigger value="info">Thông tin</TabsTrigger>
          <TabsTrigger value="attendance">Chấm công</TabsTrigger>
          <TabsTrigger value="rewards">Thưởng phạt</TabsTrigger>
          <TabsTrigger value="summary">Tổng kết</TabsTrigger>
        </TabsList>

        <TabsContent value="info">
          <EmployeeDetailInfo employee={employee} />
        </TabsContent>

        <TabsContent value="attendance">
          <EmployeeDetailAttendance />
        </TabsContent>

        <TabsContent value="rewards">
          <EmployeeDetailReward employee={employee} />
        </TabsContent>

        <TabsContent value="summary">
          <EmployeeDetailSummary employee={employee} />
        </TabsContent>
      </Tabs>

      <Dialog open={isEditOpen} onOpenChange={setIsEditOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Chỉnh sửa thông tin</DialogTitle>
          </DialogHeader>
          <EmployeeForm
            employee={employee}
            onSubmit={handleEdit}
            isLoading={isSubmitting}
          />
        </DialogContent>
      </Dialog>

      <AddRewardModal
        employee={employee}
        setIsRewardOpen={setIsRewardOpen}
        isRewardOpen={isRewardOpen}
      />
    </div>
  )
}

export default EmployeeDetailPage 