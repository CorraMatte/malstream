import React from "react";
import PropTypes from "prop-types";
import {Modal} from "reactstrap";


const ThemeModal = ({children, themeName, ...props}) => {
  props.className += " theme-dark";

  return (
    <Modal {...props}>
      {children}
    </Modal>
  );
};

ThemeModal.propTypes = {
  children: PropTypes.array.isRequired,
};

export default ThemeModal;
