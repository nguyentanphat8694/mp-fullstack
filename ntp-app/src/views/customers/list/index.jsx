import {useCallback, useEffect, useState} from "react";
import {Button} from "@/components/ui/button";
import {CustomerTable} from "@/components/customers/customer-table";
import {CustomerForm} from "@/components/customers/customer-form";
import {Search} from "lucide-react";
import {useToast} from "@/hooks/use-toast";
import {Plus} from "lucide-react";
import {URLs} from "@/helpers/url";
import {Input} from "@/components/ui/input";
import CustomSelect from "@/components/ui-custom/custom-select";
import {
  CUSTOMER_SOURCE_OPTIONS,
  CUSTOMER_STATUS_OPTIONS,
} from "@/helpers/constants";
import CustomDialog from "@/components/ui-custom/custom-dialog";
import useColumnListMutate from "@/queries/useCustomerListQuery.js";

const CustomerListPage = () => {
  const {toast} = useToast();
  const [customers, setCustomers] = useState([]);
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [staffList, setStaffList] = useState([]);
  const [filterValues, setFilterValues] = useState({
    search: "",
    source: "",
    status: "",
  });
  const [filterParams, setFilterParams] = useState({
    search: "",
    source: "",
    status: "",
  });

  const {data, isPending} = useColumnListMutate(filterParams);

  useEffect(() => {
    const fetchStaffList = async () => {
      try {
        // TODO: Call API to get staff list
        const mockStaffList = [
          {id: "1", name: "Nhân viên A"},
          {id: "2", name: "Nhân viên B"},
          // ... more mock data
        ];
        setStaffList(mockStaffList);
      } catch (error) {
        console.error("Error fetching staff list:", error);
      }
    };

    fetchStaffList();
  }, []);

  const onOpenDialogChange = useCallback((open) => {
    if (!open) setSelectedCustomer(null)
  }, []);

  const handleEdit = (customer) => {
    setSelectedCustomer(customer);
    setIsOpen(true);
  };

  const handleAssign = async (data) => {
    try {
      // TODO: Call API to assign customer
      await fetch(URLs.CUSTOMERS.ASSIGN(data.customerId), {
        method: "POST",
        body: JSON.stringify({staff_id: data.staffId}),
      });

      toast({
        title: "Thành công",
        description: "Đã phân công khách hàng",
      });
    } catch (error) {
      console.error("Error assigning customer:", error);
      toast({
        title: "Lỗi",
        description: "Không thể phân công khách hàng",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleDelete = async (customerId) => {
    try {
      // TODO: Call API to delete customer
      await fetch(URLs.CUSTOMERS.DELETE(customerId), {
        method: "DELETE",
      });

      setCustomers(customers.filter((c) => c.id !== customerId));
      toast({
        title: "Thành công",
        description: "Đã xóa khách hàng",
      });
    } catch (error) {
      console.error("Error deleting customer:", error);
      toast({
        title: "Lỗi",
        description: "Không thể xóa khách hàng",
        variant: "destructive",
      });
      throw error;
    }
  };

  const handleAddAppointment = async (data) => {
    try {
      await fetch(URLs.APPOINTMENTS.CREATE, {
        method: "POST",
        body: JSON.stringify(data),
      });

      toast({
        title: "Thành công",
        description: "Đã thêm lịch hẹn mới",
      });
    } catch (error) {
      console.error("Error adding appointment:", error);
      toast({
        title: "Lỗi",
        description: "Không thể thêm lịch hẹn",
        variant: "destructive",
      });
      throw error;
    }
  };

  const onSearch = useCallback(() => {
    setFilterParams({
      ...filterValues,
      source: filterValues.source !== 'all' ? filterValues.source : null,
      status: filterValues.status !== 'all' ? filterValues.status : null
    });
  }, [filterValues]);
  return (
    <div className="space-y-6">
      <div className="flex flex-col gap-4 sm:flex-row sm:justify-between sm:items-center">
        <h1 className="text-2xl sm:text-3xl font-bold">Danh sách khách hàng</h1>
        <CustomDialog
          className="sm:max-w-[425px]"
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          triggerNode={
            <Button className="w-full sm:w-auto">
              <Plus className="mr-2 h-4 w-4"/>
              Thêm khách hàng
            </Button>
          }
          title={
            selectedCustomer ? "Chỉnh sửa thông tin" : "Thêm khách hàng mới"
          }
          contentNode={
            <CustomerForm
              customer={selectedCustomer}
              setIsOpen={setIsOpen}
              setSelectedCustomer={setSelectedCustomer}
            />
          }
          onOpenChange={onOpenDialogChange}
        />
      </div>

      {isPending ? (
        <div>Loading...</div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            <Input
              placeholder="Tìm kiếm khách hàng..."
              value={filterValues.search}
              onChange={(e) =>
                setFilterValues((prev) => ({...prev, search: e.target.value}))
              }
              className="col-span-1 sm:col-span-2 lg:col-span-2"
            />
            <CustomSelect
              value={filterValues.source}
              onValueChange={(value) =>
                setFilterValues((prev) => ({...prev, source: value}))
              }
              triggerName="Nguồn"
              options={CUSTOMER_SOURCE_OPTIONS}
            />
            <CustomSelect
              value={filterValues.status}
              onValueChange={(value) =>
                setFilterValues((prev) => ({...prev, status: value}))
              }
              triggerName="Trạng thái"
              options={CUSTOMER_STATUS_OPTIONS}
            />
            <Button onClick={onSearch} className="w-full">
              <Search className="mr-2 h-4 w-4"/>
              Tìm kiếm
            </Button>
          </div>

          <CustomerTable
            customers={data?.data ?? []}
            onEdit={handleEdit}
            onAssign={handleAssign}
            onDelete={handleDelete}
            onAddAppointment={handleAddAppointment}
            staffList={staffList}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;
