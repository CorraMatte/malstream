import {default as ReactSelect} from "react-select";
import React from "react";


const Select = ({...props}) => {
  return (
    <ReactSelect
      className="react-select"
      classNamePrefix="react-select"
      {...props}
    />
  )
}

export default Select;
