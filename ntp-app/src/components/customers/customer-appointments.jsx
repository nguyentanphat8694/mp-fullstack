import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"

const CustomerAppointments = ({ appointments = [] }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Lịch hẹn</CardTitle>
      </CardHeader>
      <CardContent>
        {appointments.length > 0 ? (
          <div className="space-y-4">
            {appointments.map((appointment) => (
              <div 
                key={appointment.id}
                className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0"
              >
                <div>
                  <p className="font-medium">{appointment.date}</p>
                  <p className="text-sm text-muted-foreground">{appointment.note}</p>
                </div>
                <div className="text-sm text-muted-foreground">
                  {appointment.staff_name}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-center text-muted-foreground">Chưa có lịch hẹn</p>
        )}
      </CardContent>
    </Card>
  )
}

export { CustomerAppointments } 