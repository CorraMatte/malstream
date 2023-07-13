import React from 'react';
import PropTypes from 'prop-types';
import {Link} from 'react-router-dom';
import TopbarSidebarButton from './TopbarSidebarButton';
import TopbarNav from './TopbarNav';

const TopbarWithNavigation = ({ changeMobileSidebarVisibility }) => (
  <div className="topbar topbar--navigation">
    <div className="topbar__left">
      <Link className="topbar__logo" to="/" />
      <TopbarSidebarButton changeMobileSidebarVisibility={changeMobileSidebarVisibility} />
    </div>
    <TopbarNav />
    <div className="topbar__right">
    </div>
  </div>
);

TopbarWithNavigation.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
};

export default TopbarWithNavigation;
