import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';
import SidebarContent from "./SidebarContent";

const Sidebar = ({changeMobileSidebarVisibility, sidebar}) => {
  const sidebarClass = classNames({
    'sidebar sidebar--no-desktop': true,
    'sidebar--show': sidebar.show,
  });

  return (
    <div className={sidebarClass}>
      <button className="sidebar__back" type="button" onClick={
        () => {
          if (sidebar.show) {
            changeMobileSidebarVisibility()
          }
        }
      }/>
      <div className="sidebar__wrapper sidebar__wrapper--mobile">
        <SidebarContent
          onClick={changeMobileSidebarVisibility}
        />
      </div>
    </div>
  );
};

Sidebar.propTypes = {
  changeMobileSidebarVisibility: PropTypes.func.isRequired,
};


export default Sidebar;
