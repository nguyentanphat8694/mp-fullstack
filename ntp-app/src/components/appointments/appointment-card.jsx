import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {format} from "date-fns";
import {Button} from "@/components/ui/button.jsx";
import PropTypes from "prop-types";
import {useCallback} from "react";

export const AppointmentCard = ({appointment}) => {
  const onSave = useCallback(() => console.log(appointment), [appointment]);
  return <Card>
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
            onClick={onSave}
          >
            Tiếp nhận khách
          </Button>
        )}
      </div>
    </CardContent>
  </Card>
}

AppointmentCard.propTypes = {
  appointment: PropTypes.object,
}