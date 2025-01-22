import { useEffect, useState } from "react"
import { Calendar } from "@/components/ui/calendar"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useToast } from "@/hooks/use-toast"
import { format } from "date-fns"
import { vi } from "date-fns/locale"

const EmployeeAttendancePage = () => {
  const { toast } = useToast()
  const [attendance, setAttendance] = useState([])
  const [isLoading, setIsLoading] = useState(true)
  const [summary, setSummary] = useState({
    total: 0,
    present: 0,
    absent: 0,
    late: 0
  })

  useEffect(() => {
    const fetchAttendance = async () => {
      try {
        // Mock data
        const mockAttendance = [
          {
            date: "2024-02-01",
            status: "present",
            check_in: "08:00",
            check_out: "17:30"
          },
          // ... more mock data
        ]
        setAttendance(mockAttendance)
        setSummary({
          total: 20,
          present: 18,
          absent: 1,
          late: 1
        })
      } catch (error) {
        console.error("Error fetching attendance:", error)
        toast({
          title: "Lỗi",
          description: "Không thể tải dữ liệu chấm công",
          variant: "destructive"
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchAttendance()
  }, [toast])

  const attendanceDates = attendance.map(a => new Date(a.date))

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Chấm công</h1>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Tổng ngày công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{summary.total}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Có mặt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{summary.present}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Vắng mặt</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{summary.absent}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Đi muộn</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{summary.late}</div>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>Lịch chấm công</CardTitle>
          </CardHeader>
          <CardContent>
            <Calendar
              mode="multiple"
              selected={attendanceDates}
              className="rounded-md border"
              locale={vi}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Chi tiết chấm công</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {attendance.map((record) => (
                <div 
                  key={record.date}
                  className="flex items-center justify-between p-4 border rounded-lg"
                >
                  <div>
                    <p className="font-medium">
                      {format(new Date(record.date), 'EEEE, dd/MM/yyyy', { locale: vi })}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {record.check_in} - {record.check_out}
                    </p>
                  </div>
                  <Badge
                    variant={
                      record.status === 'present' 
                        ? 'success' 
                        : record.status === 'late' 
                          ? 'warning' 
                          : 'destructive'
                    }
                  >
                    {record.status === 'present' 
                      ? 'Có mặt' 
                      : record.status === 'late' 
                        ? 'Đi muộn' 
                        : 'Vắng mặt'}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

export default EmployeeAttendancePage 