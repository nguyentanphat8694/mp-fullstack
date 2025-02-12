import {useState} from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import PropTypes from "prop-types";
import {AssignCustomerModal} from "./assign-customer-modal";
import {AddAppointmentModal} from "./add-appointment-modal";
import {ActionButtons} from "@/components/customers/customer-table-actions";
import {DeleteCustomerConfirm} from "@/components/customers/delete-customer-confirm.jsx";
import {
  CUSTOMER_SOURCE_OPTIONS,
  CUSTOMER_STATUS_OPTIONS,
} from '@/helpers/constants.js';

const CustomerTable = ({ customers = [], onEdit }) => {
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [isAssignModalOpen, setIsAssignModalOpen] = useState(false);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [isAppointmentModalOpen, setIsAppointmentModalOpen] = useState(false);
  return (
    <div className="space-y-4">
      <div className="border rounded-lg">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Họ tên</TableHead>
              <TableHead>Số điện thoại</TableHead>
              <TableHead className="hidden sm:table-cell">Nguồn</TableHead>
              <TableHead className="hidden sm:table-cell">Trạng thái</TableHead>
              <TableHead className="hidden sm:table-cell">
                Nhân viên phụ trách
              </TableHead>
              <TableHead className="text-right">Thao tác</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {customers && customers.map((customer) => (
              <TableRow key={customer.id}>
                <TableCell>{customer.name}</TableCell>
                <TableCell>{customer.phone}</TableCell>
                <TableCell className="hidden sm:table-cell">
                  {CUSTOMER_SOURCE_OPTIONS[customer.source]}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {CUSTOMER_STATUS_OPTIONS[customer.status]}
                </TableCell>
                <TableCell className="hidden sm:table-cell">
                  {customer.assigned_to_name}
                </TableCell>
                <TableCell>
                  <ActionButtons
                    customer={customer}
                    setSelectedCustomer={setSelectedCustomer}
                    setIsAssignModalOpen={setIsAssignModalOpen}
                    setIsDeleteDialogOpen={setIsDeleteDialogOpen}
                    setIsAppointmentModalOpen={setIsAppointmentModalOpen}
                    onEdit={onEdit}
                  />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <AssignCustomerModal
        customer={selectedCustomer}
        isAssignModalOpen={isAssignModalOpen}
        setIsAssignModalOpen={setIsAssignModalOpen}
        setSelectedCustomer={setSelectedCustomer}
        isOpen={isAssignModalOpen}
      />

      <DeleteCustomerConfirm
        customer={selectedCustomer}
        isDeleteDialogOpen={isDeleteDialogOpen}
        setIsDeleteDialogOpen={setIsDeleteDialogOpen}
        setSelectedCustomer={setSelectedCustomer}
      />

      <AddAppointmentModal
        customer={selectedCustomer}
        isAppointmentModalOpen={isAppointmentModalOpen}
        setIsAppointmentModalOpen={setIsAppointmentModalOpen}
        setSelectedCustomer={setSelectedCustomer}
      />
    </div>
  );
};

export {CustomerTable};

CustomerTable.propTypes = {
  customers: PropTypes.array,
  onEdit: PropTypes.func,
};
