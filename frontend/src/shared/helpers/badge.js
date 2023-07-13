import classNames from "classnames";


export const getBadgeClasses = (size) => classNames({
  outline: true,
  ['badge-' + size]: size
})
