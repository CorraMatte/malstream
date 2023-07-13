import React from "react";
import PropTypes from "prop-types";


const GenericResponse = ({statusCode, message}) => {

  return (
    <div className="d-flex flex-row align-items-center" style={{color:"white"}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 text-center">
            <span className="display-1 d-block">{statusCode}</span>
            <div className="mb-4 lead">{message}</div>
          </div>
        </div>
      </div>
    </div>
  )
}


GenericResponse.propTypes = {
  statusCode: PropTypes.number.isRequired,
  message: PropTypes.string.isRequired,
}


export default GenericResponse;
