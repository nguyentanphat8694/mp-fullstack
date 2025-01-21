import { useEffect, useState } from "react"
import { format } from "date-fns"
import { Calendar } from "lucide-react"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useToast } from "@/hooks/use-toast"
import { URLs } from "@/helpers/url"

const AppointmentListPage = () => {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
        // Mock data instead of API call
        // const response = await fetch(URLs.APPOINTMENTS.TODAY)
        // const data = await response.json()
        
        const mockAppointments = [
          {
            id: 1,
            customer_name: "Nguyễn Văn A",
            customer_phone: "0123456789",
            datetime: "2024-03-20T09:30:00",
            note: "Tư vấn váy cưới",
            status: "pending"
          },
          {
            id: 2,
            customer_name: "Trần Thị B",
            customer_phone: "0987654321",
            datetime: "2024-03-20T10:00:00",
            note: "Chụp ảnh cưới ngoại cảnh",
            status: "taken"
          },
          {
            id: 3,
            customer_name: "Lê Văn C",
            customer_phone: "0369852147",
            datetime: "2024-03-20T14:15:00",
            note: "Xem mẫu album",
            status: "pending"
          },
          {
            id: 4,
            customer_name: "Phạm Thị D",
            customer_phone: "0741852963",
            datetime: "2024-03-20T15:30:00",
            note: "Tư vấn gói chụp ảnh trọn gói",
            status: "pending"
          },
          {
            id: 5,
            customer_name: "Hoàng Văn E",
            customer_phone: "0951753684",
            datetime: "2024-03-20T16:45:00",
            note: "Nhận ảnh cưới",
            status: "pending"
          }
        ]
        
        setAppointments(mockAppointments)
      } catch (error) {
        console.error("Error fetching appointments:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải danh sách lịch hẹn",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAppointments()
  }, [toast])

  const handleTakeAppointment = async (appointmentId) => {
    try {
      // Comment out API call
      // await fetch(URLs.APPOINTMENTS.TAKE(appointmentId), {
      //   method: 'PUT'
      // })
      
      // Update appointment status locally
      setAppointments(appointments.map(app => 
        app.id === appointmentId 
          ? { ...app, status: 'taken' }
          : app
      ))

      toast({
        title: "Thành công",
        description: "Đã tiếp nhận khách hàng"
      })
    } catch (error) {
      console.error("Error taking appointment:", error)
      toast({
        title: "Lỗi",
        description: "Không thể tiếp nhận khách hàng",
        variant: "destructive"
      })
    }
  }

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-2">
        <Calendar className="h-8 w-8 text-primary" />
        <h1 className="text-3xl font-bold">Lịch hẹn hôm nay</h1>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {appointments.length > 0 ? (
          appointments.map((appointment) => (
            <Card key={appointment.id}>
              <CardHeader>
                <CardTitle className="flex items-center justify-between">
                  <span>{appointment.customer_name}</span>
                  <span className="text-sm font-normal text-muted-foreground">
                    {format(new Date(appointment.datetime), 'HH:mm')}
                  </span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <p className="text-sm text-muted-foreground">Số điện thoại</p>
                    <p>{appointment.customer_phone}</p>
                  </div>
                  {appointment.note && (
                    <div>
                      <p className="text-sm text-muted-foreground">Ghi chú</p>
                      <p>{appointment.note}</p>
                    </div>
                  )}
                  {appointment.status !== 'taken' && (
                    <Button 
                      className="w-full"
                      onClick={() => handleTakeAppointment(appointment.id)}
                    >
                      Tiếp nhận khách
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          ))
        ) : (
          <p className="text-muted-foreground col-span-full text-center">
            Không có lịch hẹn nào trong ngày
          </p>
        )}
      </div>
    </div>
  )
}

export default AppointmentListPage 