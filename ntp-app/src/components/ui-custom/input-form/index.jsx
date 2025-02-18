import PropTypes from 'prop-types';
import {Label} from '@/components/ui/label.jsx';
import useFormHook from '@/hooks/useFormHook.js';
import get from 'lodash/get';
import {INPUT_TYPE} from '@/helpers/constants.js';
import {Textarea} from '@/components/ui/textarea.jsx';
import {Input} from '@/components/ui/input';
import {ImageUpload} from '@/components/ui/image-upload.jsx';

const Wrapper = ({type, name, register, value, onAction, ...rest}) => {
  switch (type) {
    default:
    case INPUT_TYPE.TEXT:
      return <Input id={`id-${name}`} {...register(name)} {...rest} />;
    case INPUT_TYPE.TEXTAREA:
      return <Textarea id={`id-${name}`} {...register(name)} {...rest} />;
    case INPUT_TYPE.DATE:
      return <Input id={`id-${name}`} type="date" {...register(
          name)} {...rest} />;
    case INPUT_TYPE.TIME:
      return <Input id={`id-${name}`} type="time" {...register(
          name)} {...rest} />;
    case INPUT_TYPE.IMAGE_UPLOAD:
      return <ImageUpload value={value} onChange={onAction} multiple />;
  }
};

Wrapper.propTypes = {
  type: PropTypes.string.isRequired,
  name: PropTypes.string.isRequired,
  register: PropTypes.func,
  value: PropTypes.any,
  onAction: PropTypes.func,
};

const InputForm = ({label, type, name, ...rest}) => {

      const {register, formState} = useFormHook();
      const error = get(formState.errors, name);
      return (
          <div className="space-y-2">
            {label && <Label htmlFor={`id-${name}`}>{label}</Label>}
            <Wrapper name={name} register={register} type={type} {...rest}/>
            {error && (<p className="text-sm text-destructive">{error.message}</p>)}
          </div>
      )
          ;
    }
;

export default InputForm;

InputForm.propTypes = {
  name: PropTypes.string.isRequired,
  label: PropTypes.string,
  type: PropTypes.string,
};
