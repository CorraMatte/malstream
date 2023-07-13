import React from "react";
import PropTypes from "prop-types";
import CardWithIcon from "./CardWithIcon";


const defaultDataAccessor = (data) => data;


const CardDataHookWithIcon = ({
  useDataHook,
  dataHookParam,
  dataAccessor = defaultDataAccessor,
  title,
  icon
}) => {
  const {data, isLoading, isIdle, isError} = useDataHook(dataHookParam);

  return (
    <CardWithIcon
      title={title}
      icon={icon}
      content={isError ? <h4>NOT AVAILABLE</h4> : <h1>{dataAccessor(data)}</h1>}
      isLoading={isLoading || isIdle}
    />
  )
}


CardDataHookWithIcon.propTypes = {
  useDataHook: PropTypes.func.isRequired,
  dataHookParam: PropTypes.string,
  dataAccessor: PropTypes.func.isRequired,
  title: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  link: PropTypes.string,
}

export default CardDataHookWithIcon;