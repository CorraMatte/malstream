import React from 'react';
import PropTypes from 'prop-types';
import SidebarLink from './SidebarLink';
import paths from '../../../config/paths'


const SidebarContent = ({onClick}) => {
  const hideSidebar = () => {
    onClick();
  };

  return (
    <div className="sidebar__content">
      <ul className="sidebar__block">
        <SidebarLink title="Dashboard" exact route={paths.homePath} icon="home" onClick={hideSidebar} />
        <SidebarLink title="Rules" exact route={paths.rulesPath} icon="code" onClick={hideSidebar} />
        <SidebarLink title="Results" exact route={paths.resultPath} icon="magnifier" onClick={hideSidebar} />
        <SidebarLink title="Retrohunt" exact route={paths.retroHuntPath} icon="undo" onClick={hideSidebar} />
      </ul>
    </div>
  );
};

SidebarContent.propTypes = {
  onClick: PropTypes.func.isRequired,
};

export default SidebarContent;
