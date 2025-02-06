import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {Calendar as CalendarIcon, Clock, Mail, MapPin, Phone} from "lucide-react";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import PropTypes from "prop-types";

export const EmployeeDetailInfo = ({employee}) => {
  return <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    <Card>
      <CardHeader>
        <CardTitle>Thông tin cá nhân</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center gap-3">
          <Mail className="h-4 w-4 text-muted-foreground"/>
          <div>
            <p className="text-sm text-muted-foreground">Email</p>
            <p className="font-medium">{employee?.email}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Phone className="h-4 w-4 text-muted-foreground"/>
          <div>
            <p className="text-sm text-muted-foreground">Số điện thoại</p>
            <p className="font-medium">{employee?.phone}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <MapPin className="h-4 w-4 text-muted-foreground"/>
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
          <CalendarIcon className="h-4 w-4 text-muted-foreground"/>
          <div>
            <p className="text-sm text-muted-foreground">Ngày vào làm</p>
            <p className="font-medium">
              {format(new Date(employee?.join_date), 'dd/MM/yyyy', {locale: vi})}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Clock className="h-4 w-4 text-muted-foreground"/>
          <div>
            <p className="text-sm text-muted-foreground">Thời gian làm việc</p>
            <p className="font-medium">8:00 - 17:30</p>
          </div>
        </div>
      </CardContent>
    </Card>
  </div>
}

EmployeeDetailInfo.propTypes = {
  employee: PropTypes.object,
}