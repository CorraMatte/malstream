import React, {Fragment} from "react";
import PropTypes from "prop-types";


const MenuEntry = ({title, value, titleStyle = {}, valueStyle = {}}) =>
  <Fragment>
    <p className="custom_card__container-subhead" style={titleStyle}>{title}</p>
    <p className="custom_card__container-title" style={valueStyle}>{value}</p>
  </Fragment>


MenuEntry.propTypes = {
  title: PropTypes.string.isRequired,
  value: PropTypes.string.isRequired,
  titleStyle: PropTypes.object,
  valueStyle: PropTypes.object
}


export default MenuEntry;
