import React from "react";
import Editor from "@monaco-editor/react";
import PropTypes from "prop-types";


const MonacoSigmaEditor = ({readOnly, ...props}) =>
  <Editor
    height="45vh"
    defaultValue=""
    language="yaml"
    theme={"vs-dark"}
    options={{
      minimap: {
        enabled: false
      },
      readOnly: readOnly
    }}
    {...props}
  />


MonacoSigmaEditor.propTypes = {
  readOnly: PropTypes.bool.isRequired
}

export default MonacoSigmaEditor;
