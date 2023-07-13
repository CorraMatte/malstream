import React from 'react';
import {NavLink} from 'react-router-dom';
import paths from "../../../config/paths";


const TopbarNav = () => (
  <nav className="topbar__nav">
    <NavLink className="topbar__nav-link" exact={true} activeClassName='selected' to={paths.homePath}>HOMEPAGE</NavLink>
    <NavLink className="topbar__nav-link" exact={true} activeClassName='selected' to={paths.rulesPath}>RULES</NavLink>
    <NavLink className="topbar__nav-link" exact={true} activeClassName='selected' to={paths.resultPath}>RESULTS</NavLink>
    <NavLink className="topbar__nav-link" exact={true} activeClassName='selected' to={paths.retroHuntPath}>RETROHUNT</NavLink>
  </nav>
);

export default TopbarNav;
