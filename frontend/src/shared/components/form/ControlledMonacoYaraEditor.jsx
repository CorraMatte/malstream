import React from "react";
import 'filepond/dist/filepond.min.css'
import {Controller} from "react-hook-form";
import PropTypes from "prop-types";
import MonacoYaraEditor from "../editor/MonacoYaraEditor";


const ControlledMonacoYaraEditor = ({
  control,
  name,
  rules = {},
  readOnly = false,
  ...monacoEditorProps
}) =>
  <Controller
    control={control}
    name={name}
    rules={rules}
    render={({field: {onChange}}) => (
      <div>
        <MonacoYaraEditor
          onChange={onChange}
          readOnly={readOnly}
          {...monacoEditorProps}
        />
      </div>)}
  />

ControlledMonacoYaraEditor.propTypes = {
  control: PropTypes.shape().isRequired,
  name: PropTypes.string.isRequired,
  readOnly: PropTypes.bool,
  rules: PropTypes.shape(),
}


export default ControlledMonacoYaraEditor;
