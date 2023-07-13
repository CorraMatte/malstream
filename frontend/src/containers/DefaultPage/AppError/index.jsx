import React from "react";

export const AppError = ({
  header = null,
  msg = null,
}) => {
  return (
    <div className="d-flex flex-row align-items-center" style={{color:"white"}}>
      <div className="container">
        <div className="row justify-content-center">
          <div className="col-md-12 text-center">
            <span className="display-1 d-block">{header || "¯\\_(\u30c4)_/¯"}</span>
            <div className="mb-4 lead">{msg || "We have encountered an unexpected error. We're sorry for the inconvenience!"}</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AppError;
