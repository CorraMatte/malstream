import {Alert} from "reactstrap";
import HelpCircleOutlineIcon from "mdi-react/HelpCircleOutlineIcon";
import React from "react";
import PropTypes from "prop-types";
import CheckOutlineIcon from "mdi-react/CheckOutlineIcon";
import CloseCircleOutlineIcon from "mdi-react/CloseCircleOutlineIcon";


const AlertBanner = ({status, message = '', className = '', children}) => {
  let Icon;

  switch (status) {
    case 'success':
      Icon = <CheckOutlineIcon />;
      break;
    case 'warning':
      Icon = <HelpCircleOutlineIcon />;
      break;
    default:
      Icon = <CloseCircleOutlineIcon />;
      break;
  }
  return (
    <Alert color={status} className={'alert--bordered ' + className} isOpen={true}>
      <div className="alert__icon">{Icon}</div>
      <div className="alert__content_indicator">
        {(message && <h4><span className="bold-text">{message}</span></h4>) || children}
      </div>
    </Alert>
  )
}


AlertBanner.propTypes = {
  status: PropTypes.string.isRequired,
  message: PropTypes.string,
  className: PropTypes.string,
}


export default AlertBanner;
