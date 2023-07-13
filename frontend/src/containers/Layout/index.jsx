import React, {useState} from 'react';
import classNames from 'classnames';
import TopbarWithNavigation from './topbar_with_navigation/TopbarWithNavigation';
import SidebarMobile from './sidebar/Sidebar';


const Layout = () => {
  const [sidebar, setSidebar] = useState({
    show: false,
    collapse: false,
  })

  const mobileSidebarVisibility = () => {
    const s = {
      collapse: sidebar.collapse,
      show: !sidebar.show
    };

    setSidebar(s);
  };

  const layoutClass = classNames({
    layout: true,
    'layout--collapse': sidebar.collapse,
    'layout--top-navigation': true
  });

  return (
    <div className={layoutClass}>
      <TopbarWithNavigation
        changeMobileSidebarVisibility={mobileSidebarVisibility}
      />
      <SidebarMobile
        sidebar={sidebar}
        changeMobileSidebarVisibility={mobileSidebarVisibility}
      />
    </div>
  );
};

export default Layout;