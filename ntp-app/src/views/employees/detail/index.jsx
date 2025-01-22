import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Calendar } from "@/components/ui/calendar"
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
import { vi } from "date-fns/locale"
import { Mail, Phone, Calendar as CalendarIcon, Award, Clock, MapPin } from "lucide-react"
import EmployeeAttendancePage from '@/views/employees/attendance';


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

  const handleAddReward = async (data) => {
    try {
      setIsSubmitting(true)
      // Mock API call
      const newItem = {
        id: Date.now(),
        date: format(new Date(), 'yyyy-MM-dd'),
        ...data
      }
      
      if (data.type === 'bonus' || data.type === 'achievement') {
        setEmployee({
          ...employee,
          rewards: [...employee.rewards, newItem]
        })
      } else {
        setEmployee({
          ...employee,
          penalties: [...employee.penalties, newItem]
        })
      }
      
      toast({
        title: "Thành công",
        description: "Đã thêm thưởng/phạt"
      })
      setIsRewardOpen(false)
    } catch (error) {
      console.error("Error adding reward/penalty:", error)
      toast({
        title: "Lỗi",
        description: "Không thể thêm thưởng/phạt",
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Thông tin cá nhân</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Email</p>
                    <p className="font-medium">{employee?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Phone className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p className="font-medium">{employee?.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <MapPin className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Địa chỉ</p>
                    <p className="font-medium">{employee?.address}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Thông tin công việc</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center gap-3">
                  <CalendarIcon className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Ngày vào làm</p>
                    <p className="font-medium">
                      {format(new Date(employee?.join_date), 'dd/MM/yyyy', { locale: vi })}
                    </p>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Clock className="h-4 w-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm text-muted-foreground">Thời gian làm việc</p>
                    <p className="font-medium">8:00 - 17:30</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="attendance">
          <EmployeeAttendancePage />
        </TabsContent>

        <TabsContent value="rewards">
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold mb-4">Thưởng</h3>
              <div className="space-y-4">
                {employee.rewards.map((reward) => (
                  <div 
                    key={reward.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <p className="font-medium">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(reward.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(reward.date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{reward.reason}</p>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold mb-4">Phạt</h3>
              <div className="space-y-4">
                {employee.penalties.map((penalty) => (
                  <div 
                    key={penalty.id}
                    className="rounded-lg border p-4 space-y-2"
                  >
                    <div className="flex justify-between">
                      <p className="font-medium text-destructive">
                        {new Intl.NumberFormat('vi-VN', {
                          style: 'currency',
                          currency: 'VND'
                        }).format(penalty.amount)}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {format(new Date(penalty.date), 'dd/MM/yyyy')}
                      </p>
                    </div>
                    <p className="text-sm text-muted-foreground">{penalty.reason}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="summary">
          <div className="grid gap-6 md:grid-cols-2">
            <Card>
              <CardHeader>
                <CardTitle>Tổng kết tháng {format(new Date(), 'MM/yyyy', { locale: vi })}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng ngày công</p>
                    <p className="text-2xl font-bold">22/22</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Đi muộn</p>
                    <p className="text-2xl font-bold text-yellow-600">1</p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng thưởng</p>
                    <p className="text-2xl font-bold text-green-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(1500000)}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">Tổng phạt</p>
                    <p className="text-2xl font-bold text-red-600">
                      {new Intl.NumberFormat('vi-VN', {
                        style: 'currency',
                        currency: 'VND'
                      }).format(200000)}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Biểu đồ chấm công</CardTitle>
              </CardHeader>
              <CardContent>
                <Calendar
                  mode="multiple"
                  selected={employee?.attendance?.map(a => new Date(a.date))}
                  className="rounded-md border"
                  locale={vi}
                />
              </CardContent>
            </Card>
          </div>
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
        isOpen={isRewardOpen}
        onClose={() => setIsRewardOpen(false)}
        onSubmit={handleAddReward}
        isLoading={isSubmitting}
      />
    </div>
  )
}

export default EmployeeDetailPage 