import PropTypes from "prop-types";
import useUserByRole from "@/queries/useUserByRoleQuery";
import CustomSelect from "@/components/ui-custom/custom-select";
import {useMemo} from "react";

const getDisplayArray = (rawArr) => rawArr ? rawArr.map((item) => ({value: item.id, label: item.display_name})) : [];

export const UserSelect = ({control, rules, name, roles = [], onValueChange, value, ...rest}) => {
  const {data, isPending} = useUserByRole(roles);
  const users = useMemo(() => {
    if (!isPending && data && data?.data?.data.length > 0) {
      return getDisplayArray(data?.data?.data);
    } else {
      return [];
    }
  }, [data]);
  return <CustomSelect
    value={value}
    onValueChange={onValueChange}
    name={name}
    control={control}
    rules={rules}
    triggerName="Chọn nhân viên"
    options={users}
    {...rest}
  />;
}

UserSelect.propTypes = {
  roles: PropTypes.array,
  name: PropTypes.string,
  onValueChange: PropTypes.func,
  value: PropTypes.any,
  control: PropTypes.any,
  rules: PropTypes.object,
}