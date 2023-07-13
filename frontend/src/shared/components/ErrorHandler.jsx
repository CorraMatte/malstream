import React from "react";
import PropTypes from "prop-types";
import NotFound404 from "../../containers/DefaultPage/404";
import AppError from "../../containers/DefaultPage/AppError";
import NotAllowed401 from "../../containers/DefaultPage/401";


const ErrorHandler = ({error}) => {
  const errorStatus = error?.response?.status;

  if (!errorStatus) {
    return <AppError />
  }

  switch (errorStatus) {
    case 401:
      return <NotAllowed401 />
    case 404:
      return <NotFound404 />
    default:
      return <AppError />
  }
}

ErrorHandler.propTypes = {
  error: PropTypes.shape().isRequired
}

export default ErrorHandler;
