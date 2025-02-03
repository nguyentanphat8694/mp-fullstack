import PropTypes from "prop-types";
import useUserByRole from "@/queries/useUserByRole.js";
import CustomSelect from "@/components/ui-custom/custom-select";

export const UserSelect = ({name, control, rules, role = ""}) => {
  const {data} = useUserByRole(role);
  return <CustomSelect
    name={name}
    control={control}
    rules={rules}
    triggerName="Chọn nhân viên"
    options={data?.data ?? []}
  />;
}

UserSelect.propTypes = {
  role: PropTypes.string,
  name: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
}