import React from 'react';
import PropTypes from 'prop-types';

const icon = `${process.env.PUBLIC_URL}/img/burger.svg`;

const TopbarSidebarButton = ({ changeMobileSidebarVisibility }) => (
  <div>
    <button
      className="topbar__button topbar__button--desktop"
      type="button"
      onClick={changeMobileSidebarVisibility}
    >
      <img src={icon} alt="" className="topbar__button-icon" />
    </button>
    <button
      className="topbar__button topbar__button--mobile"
      type="button"
      onClick={changeMobileSidebarVisibility}
    >
      <img src={icon} alt="" className="topbar__button-icon" />
    </button>
  </div>
);

TopbarSidebarButton.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
};

export default TopbarSidebarButton;
