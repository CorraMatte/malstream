import React from "react";
import GenericResponse from "../components/GenericResponse";

export const NotFound404 = () => {
  return <GenericResponse statusCode={404} message={'The page you are looking for was not found.'} />
}

export default NotFound404;
