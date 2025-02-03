import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import PropTypes from "prop-types";

export const CustomSelect = ({triggerName, options, value, onValueChange, className}) => {
  return (
    <Select
      className={className}
      value={value}
      onValueChange={onValueChange}
    >
      <SelectTrigger>
        <SelectValue placeholder={triggerName} />
      </SelectTrigger>
      {options && options.length > 0 && (
        <SelectContent>
          {options.map(item => <SelectItem key={`custom-select-${triggerName}-${item.value}`} value={item.value}>{item.label}</SelectItem>)}
        </SelectContent>
      )}
    </Select>
  );
}

CustomSelect.propTypes = {
  triggerName: PropTypes.string,
  options: PropTypes.array,
  onValueChange: PropTypes.func,
  value: PropTypes.any,
  className: PropTypes.string,
}