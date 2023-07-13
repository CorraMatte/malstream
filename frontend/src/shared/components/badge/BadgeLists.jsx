import React from "react";
import PropTypes from "prop-types";
import ColorTagInlineBadge from "./ColorTagInlineBadge";


export const ColorTagInlineBadgeList = ({
  items,
  color = 'secondary',
  size = '',
  space = ' ',
  style = {}
}) => {
  if (items.length === 0) {
    return null;
  }

  return items.map((item, index) =>
    <ColorTagInlineBadge color={color} tag={item} size={size} style={style} key={index}/>
  ).reduce((prev, curr) => [prev, space, curr])
}


ColorTagInlineBadgeList.propType = {
  items: PropTypes.array.isRequired,
  color: PropTypes.string,
  size: PropTypes.string,
  space: PropTypes.string,
  style: PropTypes.object
}



