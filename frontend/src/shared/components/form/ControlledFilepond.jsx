import {FilePond} from 'react-filepond'
import React, {useState} from "react";
import 'filepond/dist/filepond.min.css'
import {Controller} from "react-hook-form";
import PropTypes from "prop-types";


const ControlledFilepond = ({
  control,
  name,
  defaultValue = '',
  ...filepondProps
}) => {
  const [files, setFiles] = useState(defaultValue ? [{
    // set type to local to indicate an already uploaded file
    options: {
      type: 'local',

      // mock file information
      file: {
        name: defaultValue,
        size: 0,
      },
    },
  }] : []);

  return (
    <Controller
      control={control}
      name={name}
      render={({field: {onChange}}) => (
        <div>
          <FilePond
            files={files}
            onupdatefiles={(files) => {
              onChange(files);
              setFiles(files);
            }}
            {...filepondProps}
            credits={null}
          />
        </div>)}
    />
  )
}

ControlledFilepond.propTypes = {
  control: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
}


export default ControlledFilepond;