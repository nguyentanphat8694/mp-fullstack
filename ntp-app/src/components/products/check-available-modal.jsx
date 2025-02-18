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
import {CheckCircle, XCircle} from 'lucide-react';
import {Input} from '@/components/ui/input';
import PropTypes from 'prop-types';
import useProductCheckQuery from '@/queries/useProductCheckQuery';
import {useForm} from 'react-hook-form';

export const CheckAvailableModal = ({
  showCheckModal,
  setShowCheckModal,
  setSelectedProduct,
  productId,
  productName,
}) => {
  const {
    register,
    handleSubmit,
    watch,
    setValue,
    formState: {errors}
  } = useForm({
    defaultValues: {
      startDate: "",
      endDate: "",
    }
  });

  const startDate = watch('startDate');
  const endDate = watch('endDate');
  const [filterParams, setFilterParams] = useState(null);
  const [isChecked, setIsChecked] = useState(false);

  // Integration code
  const {data: checkResult, isPending: isChecking} = useProductCheckQuery(
    productId,
    filterParams
  );

  const onClose = useCallback(() => {
    setShowCheckModal(false);
    setSelectedProduct?.(null);
  }, []);

  const validateDates = (start, end) => {
    if (start && end) {
      const startDate = new Date(start);
      const endDate = new Date(end);
      
      if (isAfter(startDate, endDate)) {
        return 'Ngày bắt đầu phải nhỏ hơn hoặc bằng ngày kết thúc';
      }
    }
    return true;
  };

  const handleCheck = (data) => {
    if (!data.startDate || !data.endDate) return;
    
    setFilterParams({
      startDate: format(new Date(data.startDate), 'yyyy-MM-dd HH:mm:ss'),
      endDate: format(new Date(data.endDate), 'yyyy-MM-dd HH:mm:ss')
    });
    setIsChecked(true);
  };
  return (
    <Dialog open={showCheckModal} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[425px] max-h-[80vh] overflow-auto flex flex-col">
        <DialogHeader>
          <DialogTitle>Kiểm tra tình trạng sản phẩm</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleCheck)} className="space-y-4">
          <div>
            <Label>Sản phẩm</Label>
            <p className="text-sm font-medium">{productName}</p>
          </div>

          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="startDate">Ngày bắt đầu</Label>
              <Input
                id="startDate"
                type="date"
                {...register("startDate", {
                  required: "Vui lòng chọn ngày bắt đầu",
                  validate: (value) => validateDates(value, endDate)
                })}
              />
              {errors.startDate && (
                <p className="text-sm text-destructive">{errors.startDate.message}</p>
              )}
            </div>

            <div className="grid gap-2">
              <Label htmlFor="endDate">Ngày kết thúc</Label>
              <Input
                id="endDate"
                type="date"
                {...register("endDate", {
                  required: "Vui lòng chọn ngày kết thúc",
                  validate: (value) => validateDates(startDate, value)
                })}
              />
              {errors.endDate && (
                <p className="text-sm text-destructive">{errors.endDate.message}</p>
              )}
            </div>
          </div>

          {/* Result alerts */}
          {isChecked && checkResult?.data?.data && (
            <Alert variant={checkResult.data.data.length ? 'default' : 'destructive'}>
              <AlertDescription className="flex items-center gap-2">
                {checkResult.data.data.length === 0 ? (
                  <>
                    <CheckCircle className="h-4 w-4 text-green-500"/>
                    <span className="text-green-500">Sản phẩm có sẵn trong khoảng thời gian này</span>
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

          {/* Unavailable dates list */}
          {checkResult?.data?.data && !checkResult.data.data.isAvailable && (
            <div className="space-y-2">
              {checkResult.data.data.map((item) => (
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

          <div className="flex justify-end gap-4 pt-4 border-t">
            <Button type="button" variant="outline" onClick={onClose}>
              Đóng
            </Button>
            <Button
              type="submit"
              disabled={!startDate || !endDate || isChecking}
            >
              {isChecking ? 'Đang kiểm tra...' : 'Kiểm tra'}
            </Button>
          </div>
        </form>
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