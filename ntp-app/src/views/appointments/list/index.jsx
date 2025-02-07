import { useEffect, useState } from "react"
import { Calendar } from "lucide-react"
import { useToast } from "@/hooks/use-toast"
import {AppointmentCard} from "@/components/appointments/appointment-card.jsx";

const AppointmentListPage = () => {
  const { toast } = useToast()
  const [appointments, setAppointments] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchAppointments = async () => {
      try {
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
            <AppointmentCard key={appointment.id} appointment={appointment} />
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