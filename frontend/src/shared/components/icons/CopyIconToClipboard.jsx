import PropTypes from "prop-types";
import {copyTargetContent} from "../../helpers";
import toast from "react-hot-toast";
import ContentCopyIcon from "mdi-react/ContentCopyIcon";
import React from "react";


const CopyIconToClipboard = ({value, copiedMessage = '', style = {}, size = 24, toastProps = {}}) => {
  copiedMessage = copiedMessage ? copiedMessage : value;
  return (
    <ContentCopyIcon
      onClick={(e) => {
        e.stopPropagation();
        copyTargetContent(value);
        toast(`Copied ${copiedMessage}`, {icon: '📄', ...toastProps});
      }}
      size={size}
      style={Object.assign({}, {fill: 'white', padding: '2px'}, style)}
      className={'border-hover-white'}
    />
  )
}


CopyIconToClipboard.propTypes = {
  value: PropTypes.string.isRequired,
  style: PropTypes.shape(),
  size: PropTypes.number,
  copiedMessage: PropTypes.string,
  toastProps: PropTypes.shape()
}


export default CopyIconToClipboard;
