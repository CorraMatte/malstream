import React from "react";
import PropTypes from "prop-types";
import {Col} from "reactstrap";
import {getErrorMessageFromResponse} from "../../../shared/helpers";
import AlertBanner from "../../../shared/components/AlertBanner";


const IndicatorErrorHandler = ({error}) => {
  const statusCode = error.response.status;

  let errorMessage = '';
  if (statusCode === 400) {
    errorMessage = 'Insert a valid SHA256'
  } else if (statusCode === 404) {
    errorMessage = 'SHA256 not found in the database'
  } else {
    errorMessage = getErrorMessageFromResponse(error);
  }

  return (
    <Col>
      <AlertBanner status={'danger'} message={errorMessage} />
    </Col>
  );
}


IndicatorErrorHandler.propTypes = {
  error: PropTypes.shape().isRequired
}


export default IndicatorErrorHandler;
