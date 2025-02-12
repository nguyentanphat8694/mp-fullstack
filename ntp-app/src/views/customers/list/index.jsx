import {useCallback, useState} from "react";
import {Button} from "@/components/ui/button";
import {CustomerTable} from "@/components/customers/customer-table";
import {CustomerForm} from "@/components/customers/customer-form";
import {BookUser, Search} from "lucide-react";
import {Plus} from "lucide-react";
import {Input} from "@/components/ui/input";
import CustomSelect from "@/components/ui-custom/custom-select";
import {
  CUSTOMER_SOURCE_OPTIONS,
  CUSTOMER_STATUS_OPTIONS,
} from "@/helpers/constants";
import CustomDialog from "@/components/ui-custom/custom-dialog";
import useCustomerListQuery from "@/queries/useCustomerListQuery.js";
import {CustomPageTitle} from "@/components/ui-custom/custom-page-title/index.jsx";

const CustomerListPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [filterValues, setFilterValues] = useState({
    search: "",
  });
  const [filterParams, setFilterParams] = useState({
    search: "",
  });

  const {data, isPending} = useCustomerListQuery(filterParams);

  const onOpenDialogChange = useCallback((open) => {
    if (!open) setSelectedCustomer(null)
  }, []);

  const handleEdit = useCallback((customer) => {
    setSelectedCustomer(customer);
    setIsOpen(true);
  }, []);

  const onSearch = useCallback(() => {
    let newFilter = {
      search: filterValues.search,
    }
    if (filterValues.source !== 'all'){
      newFilter.source = filterValues.source;
    }
    if (filterValues.status !== 'all'){
      newFilter.status = filterValues.status;
    }
    setFilterParams(newFilter);
  }, [filterValues]);
  return (
    <div className="space-y-6">
      <CustomPageTitle title={'Danh sách khách hàng'} icon={<BookUser className="h-6 w-6 text-primary" />} />

      <div className="flex flex-col lg:justify-end gap-4 items-start sm:flex-row sm:justify-between sm:items-center">
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
            customers={data?.data?.data?.data ?? []}
            onEdit={handleEdit}
          />
        </div>
      )}
    </div>
  );
};

export default CustomerListPage;
