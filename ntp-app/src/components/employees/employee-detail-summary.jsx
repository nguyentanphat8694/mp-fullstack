import {Card, CardContent, CardHeader, CardTitle} from "@/components/ui/card.jsx";
import {format} from "date-fns";
import {vi} from "date-fns/locale";
import {Calendar} from "@/components/ui/calendar.jsx";
import PropTypes from "prop-types";

export const EmployeeDetailSummary = ({ employee }) => {
  return (<div className="grid gap-6 md:grid-cols-2">
    <Card>
      <CardHeader>
        <CardTitle>Tổng kết tháng {format(new Date(), 'MM/yyyy', {locale: vi})}</CardTitle>
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
  </div>);
}

EmployeeDetailSummary.propTypes = {
  employee: PropTypes.object,
}