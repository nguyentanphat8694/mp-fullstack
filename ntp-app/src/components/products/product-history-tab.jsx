import {
  Select,
  SelectContent, SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select.jsx';
import {format} from 'date-fns';
import {Badge} from '@/components/ui/badge.jsx';
import PropTypes from 'prop-types';
import {useState} from 'react';

export const ProductHistoryTab = ({ productId, rentalHistory }) => {
  // Filter states for rental history
  const [yearFilter, setYearFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  return <div className="space-y-6">
    <div className="flex gap-4">
      <Select value={yearFilter} onValueChange={setYearFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Lọc theo năm"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả các năm</SelectItem>
          <SelectItem value="2024">2024</SelectItem>
          <SelectItem value="2023">2023</SelectItem>
        </SelectContent>
      </Select>

      <Select value={statusFilter} onValueChange={setStatusFilter}>
        <SelectTrigger className="w-[180px]">
          <SelectValue placeholder="Lọc theo trạng thái"/>
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">Tất cả trạng thái</SelectItem>
          <SelectItem value="completed">Đã hoàn thành</SelectItem>
          <SelectItem value="cancelled">Đã hủy</SelectItem>
        </SelectContent>
      </Select>
    </div>

    <div className="space-y-4">
      {rentalHistory.filter(item =>
          (yearFilter === "all" ||
              new Date(item.rental_start).getFullYear().toString() ===
              yearFilter) &&
          (statusFilter === "all" || item.status === statusFilter)
      ).map((item) => (
          <div
              key={item.id}
              className="rounded-lg border p-4 space-y-2"
          >
            <div className="flex justify-between items-start">
              <div>
                <p className="font-medium">{item.customer_name}</p>
                <p className="text-sm text-muted-foreground">
                  {format(new Date(item.rental_start), 'dd/MM/yyyy')} - {format(
                    new Date(item.rental_end), 'dd/MM/yyyy')}
                </p>
              </div>
              <Badge className={
                item.status === 'completed' ? 'bg-green-500' : 'bg-red-500'
              }>
                {item.status === 'completed' ? 'Đã hoàn thành' : 'Đã hủy'}
              </Badge>
            </div>
            {item.note && (
                <p className="text-sm text-muted-foreground">{item.note}</p>
            )}
          </div>
      ))}
    </div>
  </div>
}

ProductHistoryTab.propTypes = {
  productId: PropTypes.string,
  rentalHistory: PropTypes.array
}