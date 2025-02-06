import {Select, SelectContent, SelectItem, SelectTrigger, SelectValue} from "@/components/ui/select.jsx";
import PropTypes from "prop-types";
import {Controller} from "react-hook-form";

const CustomSelect = ({triggerName, options, value, onValueChange, name, control, rules, className, ...rest}) => {
  return name && control ? (<Controller
    name={name}
    control={control}
    rules={rules}
    render={({field}) => (<Select
      value={value}
      onValueChange={(obj) => {
        field.onChange && field.onChange(obj);
        onValueChange && onValueChange(obj);
      }}
      {...rest}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={triggerName}/>
      </SelectTrigger>
      {options && options.length > 0 && (
        <SelectContent>
          {options.map(item => <SelectItem key={`custom-select-${triggerName}-${item.value}`}
                                           value={item.value}>{item.label}</SelectItem>)}
        </SelectContent>
      )}
    </Select>)}
  />) : (
    <Select
      value={value}
      onValueChange={onValueChange}
      {...rest}
    >
      <SelectTrigger className={className}>
        <SelectValue placeholder={triggerName}/>
      </SelectTrigger>
      {options && options.length > 0 && (
        <SelectContent>
          {options.map(item => <SelectItem key={`custom-select-${triggerName}-${item.value}`}
                                           value={item.value}>{item.label}</SelectItem>)}
        </SelectContent>
      )}
    </Select>
  );
};

export default CustomSelect;

CustomSelect.propTypes = {
  triggerName: PropTypes.string,
  options: PropTypes.array,
  onValueChange: PropTypes.func,
  value: PropTypes.any,
  className: PropTypes.string,
  name: PropTypes.string,
  control: PropTypes.object,
  rules: PropTypes.object,
}