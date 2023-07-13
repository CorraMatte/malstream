import {Controller} from "react-hook-form";
import Select from "./Select";
import React from "react";
import PropTypes from "prop-types";

const ControlledSelectWithTitle = ({
  control,
  title,
  name,
  valueFn,
  rules = {},
  withError = false,
  defaultValue = null,
  error = null,
  ...selectProps
}) => {

  return (
    <div className={`form__form-group ${error ? "form__form-group-error-validation" : ""}`}>
      <span className="form__form-group-label">{title}</span>
      <div className="form__form-group-field">
        <div className='form__form-group-input-wrap'>
          <Controller
            control={control}
            name={name}
            rules={rules}
            defaultValue={defaultValue}
            render={({field: {onChange, value, ref}}) => (
              <Select
                onChange={onChange}
                inputRef={ref}
                defaultValue={defaultValue}
                value={valueFn(value)}
                {...selectProps}
              />
            )}
          />
          {withError && error && <span className="form__form-group-error">{error.message}</span>}
        </div>
      </div>
    </div>
  )
}


ControlledSelectWithTitle.propTypes = {
  control: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
  valueFn: PropTypes.func,
  withError: PropTypes.bool,
  title: PropTypes.string.isRequired,
}


export default ControlledSelectWithTitle;
