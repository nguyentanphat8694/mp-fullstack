import ErrorBoundary from '@/components/ui-custom/error-boundary';
import { FormHookContext } from '@/hooks/useFormHook';
import PropTypes from 'prop-types';
import { useCallback } from 'react';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';

const Form = ({
                className,
                children,
                defaultValues = {},
                values = {},
                mode = 'onBlur',
                reValidateMode = 'onChange',
                shouldFocusError = true,
                schema,
                onSubmit,
                context,
              }) => {
  const {
    handleSubmit,
    watch,
    register,
    setValue,
    setFocus,
    getValues,
    control,
    formState,
    reset,
    resetField
  } = useForm({
    defaultValues,
    values,
    mode,
    reValidateMode,
    shouldFocusError,
    resolver: schema && yupResolver(schema),
    context: context
  });

  const onFormSubmit = useCallback(
      (data) => onSubmit && onSubmit(data),
      [onSubmit]
  );

  return (
      <FormHookContext.Provider
          value={{
            watch,
            control,
            register,
            formState,
            setValue,
            setFocus,
            getValues,
            resetField,
            reset,
            defaultValues
          }}>
        <ErrorBoundary>
          <form className={className} onSubmit={handleSubmit(onFormSubmit)}>
            {children}
          </form>
        </ErrorBoundary>
      </FormHookContext.Provider>
  );
};

export default Form;

Form.propTypes = {
  className: PropTypes.string,
  children: PropTypes.node,
  defaultValues: PropTypes.object,
  values: PropTypes.object,
  mode: PropTypes.string,
  reValidateMode: PropTypes.string,
  shouldFocusError: PropTypes.bool,
  schema: PropTypes.object,
  onSubmit: PropTypes.func,
  context: PropTypes.object,
  defaultValue: PropTypes.object,
};
