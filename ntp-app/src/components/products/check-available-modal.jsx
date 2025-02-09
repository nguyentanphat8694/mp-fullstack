import {useCallback, useState} from 'react';
import {format, isAfter, isBefore, parse} from 'date-fns';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {Button} from '@/components/ui/button';
import {Label} from '@/components/ui/label';
import {Alert, AlertDescription} from '@/components/ui/alert';
import {CheckCircle, XCircle, Calendar as CalendarIcon} from 'lucide-react';
import {Input} from '@/components/ui/input';
import {Calendar} from '@/components/ui/calendar';
import {Popover, PopoverContent, PopoverTrigger} from '@/components/ui/popover';
import PropTypes from 'prop-types';
import useProductCheckQuery from '@/queries/useProductCheckQuery';

export const CheckAvailableModal = ({
  showCheckModal,
  setShowCheckModal,
  setSelectedProduct,
  productId,
  productName,
}) => {
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [startDateInput, setStartDateInput] = useState('');
  const [endDateInput, setEndDateInput] = useState('');
  const [dateError, setDateError] = useState('');
  const [filterParams, setFilterParams] = useState(null);

  // Integration code
  // const {data: checkResult, isPending: isChecking} = useProductCheckQuery(
  //   productId,
  //   filterParams
  // );

  // Mock data for testing UI
  const mockCheckResult = {
    data: {
      isAvailable: false,
      schedule: [
        {
          contract_id: "CT001",
          customer_name: "Nguyễn Văn A",
          start_date: "2024-03-20 09:00:00",
          end_date: "2024-03-22 17:00:00"
        },
        {
          contract_id: "CT002",
          customer_name: "Trần Thị B",
          start_date: "2024-03-25 09:00:00",
          end_date: "2024-03-27 17:00:00"
        }
      ]
    }
  };
  const isChecking = false;
  const checkResult = mockCheckResult;

  const onClose = useCallback(() => {
    setShowCheckModal && setShowCheckModal(false);
    setSelectedProduct && setSelectedProduct(null);
    setStartDate(null);
    setEndDate(null);
    setStartDateInput('');
    setEndDateInput('');
    setDateError('');
    setFilterParams(null);
  }, []);

  const handleDateInputChange = (value, isStart = true) => {
    try {
      if (!value) {
        isStart ? setStartDate(null) : setEndDate(null);
        isStart ? setStartDateInput('') : setEndDateInput('');
        return;
      }

      // Try to parse the input date
      const parsedDate = parse(value, 'dd/MM/yyyy', new Date());
      
      if (isStart) {
        if (endDate && isAfter(parsedDate, endDate)) {
          setDateError('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
          return;
        }
        setStartDate(parsedDate);
        setStartDateInput(value);
        setDateError('');
      } else {
        if (startDate && isBefore(parsedDate, startDate)) {
          setDateError('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
          return;
        }
        setEndDate(parsedDate);
        setEndDateInput(value);
        setDateError('');
      }
    } catch (error) {
      console.log(error);
      setDateError('Ngày không hợp lệ. Vui lòng nhập theo định dạng dd/MM/yyyy');
    }
  };

  const handleCalendarSelect = (date, isStart) => {
    if (isStart) {
      if (endDate && isAfter(date, endDate)) {
        setDateError('Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc');
        return;
      }
      setStartDate(date);
      setStartDateInput(format(date, 'dd/MM/yyyy'));
      setDateError('');
    } else {
      if (startDate && isBefore(date, startDate)) {
        setDateError('Ngày kết thúc phải lớn hơn hoặc bằng ngày bắt đầu');
        return;
      }
      setEndDate(date);
      setEndDateInput(format(date, 'dd/MM/yyyy'));
      setDateError('');
    }
  };

  const handleCheck = () => {
    if (!startDate || !endDate || dateError) return;
    
    setFilterParams({
      startDate: format(startDate, 'yyyy-MM-dd HH:mm:ss'),
      endDate: format(endDate, 'yyyy-MM-dd HH:mm:ss')
    });
  };

  return (
    <Dialog open={showCheckModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Kiểm tra tình trạng sản phẩm</DialogTitle>
        </DialogHeader>
        <div className="space-y-4 overflow-y-auto pr-2">
          <div>
            <Label>Sản phẩm</Label>
            <p className="text-sm font-medium">{productName}</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label>Ngày bắt đầu</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="dd/MM/yyyy"
                  value={startDateInput}
                  onChange={(e) => handleDateInputChange(e.target.value, true)}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="px-2">
                      <CalendarIcon className="h-4 w-4"/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={startDate}
                      onSelect={(date) => handleCalendarSelect(date, true)}
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label>Ngày kết thúc</Label>
              <div className="flex gap-2">
                <Input
                  placeholder="dd/MM/yyyy"
                  value={endDateInput}
                  onChange={(e) => handleDateInputChange(e.target.value, false)}
                />
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="px-2">
                      <CalendarIcon className="h-4 w-4"/>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={endDate}
                      onSelect={(date) => handleCalendarSelect(date, false)}
                      disabled={(date) => isBefore(date, new Date())}
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>

          {dateError && (
            <Alert variant="destructive">
              <AlertDescription>{dateError}</AlertDescription>
            </Alert>
          )}

          {checkResult?.data && (
            <Alert variant={checkResult.data.isAvailable ? 'default' : 'destructive'}>
              <AlertDescription className="flex items-center gap-2">
                {checkResult.data.isAvailable ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500"/>
                    <span>Sản phẩm có sẵn trong khoảng thời gian này</span>
                  </>
                ) : (
                  <>
                    <XCircle className="h-4 w-4"/>
                    <span>Sản phẩm đã được đặt trong các ngày:</span>
                  </>
                )}
              </AlertDescription>
            </Alert>
          )}

          {checkResult?.data && !checkResult.data.isAvailable && (
            <div className="space-y-2">
              {checkResult.data.schedule.map((item) => (
                <div
                  key={item.contract_id}
                  className="rounded-lg border p-3 text-sm space-y-2"
                >
                  <div className="flex justify-between items-center">
                    <p className="font-medium">{item.customer_name}</p>
                    <span className="text-xs bg-muted px-2 py-1 rounded">
                      HD: {item.contract_id}
                    </span>
                  </div>
                  <p className="text-muted-foreground">
                    {format(new Date(item.start_date), 'dd/MM/yyyy HH:mm')} - {format(
                      new Date(item.end_date), 'dd/MM/yyyy HH:mm')}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="flex justify-end gap-4 pt-4 border-t mt-4">
          <Button variant="outline" onClick={onClose}>
            Đóng
          </Button>
          <Button
            onClick={handleCheck}
            disabled={!startDate || !endDate || isChecking || dateError}
          >
            {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};

CheckAvailableModal.propTypes = {
  showCheckModal: PropTypes.bool,
  setShowCheckModal: PropTypes.func,
  setSelectedProduct: PropTypes.func,
  productId: PropTypes.number,
  productName: PropTypes.string,
};