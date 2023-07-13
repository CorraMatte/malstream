import React from 'react';
import PropTypes from 'prop-types';
import {CardBody} from 'reactstrap';
import {Link} from "react-router-dom";

const TimeLineIcon = ({ type }) => {
  let Icon;

  switch (type) {
    case 'work':
      Icon = <span className="lnr lnr-briefcase" />;
      break;
    case 'video':
      Icon = <span className="lnr lnr-film-play" />;
      break;
    case 'file':
      Icon = <span className="lnr lnr-file-add" />;
      break;
    default:
      break;
  }

  return (
    <div className={`timeline__icon ${type}`}>
      {Icon}
    </div>
  );
};

TimeLineIcon.propTypes = {
  type: PropTypes.string,
};

TimeLineIcon.defaultProps = {
  type: '',
};

const TimeLineItem = ({
  type, img, title, date, children, link, icon = null
}) => (
  <div className="timeline__item">
    {img
      ? <div className="timeline__icon"><img src={img} alt="img" /></div>
      : <TimeLineIcon type={type} />
    }
    {icon && <div className="timeline__icon"><span className="lnr">{icon}</span></div>}
    <CardBody className="timeline__content">
      <h5 className="timeline__title">
        {link ? <Link to={link}>{title}</Link> : title}
      </h5>
      <h4 className="subhead timeline__date">{date}</h4>
      {children}
    </CardBody>
  </div>
);

TimeLineItem.propTypes = {
  type: PropTypes.string,
  img: PropTypes.string,
  title: PropTypes.string,
  date: PropTypes.string,
  link: PropTypes.string,
  children: PropTypes.element.isRequired,
};

TimeLineItem.defaultProps = {
  type: '',
  img: '',
  title: '',
  date: '',
};

export default TimeLineItem;
