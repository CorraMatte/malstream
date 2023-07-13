import React from "react";
import GenericResponse from "../components/GenericResponse";

export const NotAllowed401 = () => {
  return <GenericResponse statusCode={401} message={"You don't have the permissions to visit this page."} />
}

export default NotAllowed401;
