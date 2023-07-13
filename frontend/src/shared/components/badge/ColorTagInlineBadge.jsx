import React from "react";
import {Badge} from "reactstrap";
import PropTypes from "prop-types";
import {getBadgeClasses} from "../../helpers/badge";


const _ = require('lodash')


const ColorTagInlineBadge = ({color, tag, size = '', style = {}}) => {
  const classes = getBadgeClasses(size);

  return <Badge color={color} className={classes} style={style}>{_.toUpper(tag)}</Badge>;
}


ColorTagInlineBadge.propTypes = {
  color: PropTypes.string.isRequired,
  tag: PropTypes.string.isRequired,
  size: PropTypes.string,
  style: PropTypes.object
}


export default ColorTagInlineBadge;
