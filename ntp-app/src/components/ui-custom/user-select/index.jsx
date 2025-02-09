import PropTypes from "prop-types";
import useUserByRole from "@/queries/useUserByRoleQuery";
import CustomSelect from "@/components/ui-custom/custom-select";

const user = [
  {
    id: 1,
    display_name: 'Nguyen Van A'
  },
  {
    id: 2,
    display_name: 'Doan Minh B'
  },
  {
    id: 3,
    display_name: 'Hoang Thi C'
  }
];

const getDisplayArray = (rawArr) => rawArr.map((item) => ({value: item.id, label: item.display_name}));

export const UserSelect = ({name, role = [], ...rest}) => {
  const {data} = useUserByRole(role);
  return <CustomSelect
    name={name}
    triggerName="Chọn nhân viên"
    // options={data?.data ?? []}
    options={getDisplayArray(user)}
    {...rest}
  />;
}

UserSelect.propTypes = {
  role: PropTypes.array,
  name: PropTypes.string,
}