import React from 'react';
import PropTypes from 'prop-types';
import {Toaster} from "react-hot-toast";


const MainWrapper = ({children}) =>
  <div className={`theme-dark`}>
    <Toaster position="top-right" toastOptions={{
      className: 'toast-default'
    }}/>
    <div className="wrapper">
      {children}
    </div>
  </div>


MainWrapper.propTypes = {
  children: PropTypes.element.isRequired,
  location: PropTypes.shape({
    pathname: PropTypes.string,
  }).isRequired,
};

export default MainWrapper;
