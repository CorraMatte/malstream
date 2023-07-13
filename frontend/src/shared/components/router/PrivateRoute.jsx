import React from "react";
import {Route} from "react-router-dom";


const PrivateRoute = ({ children, validateUser, ...rest}) => {

  // return !isLoading && (
  //   <Route
  //     {...rest}
  //     render={({location}) =>
  //       (isAuthenticated && user && validateUser(user)) ? (
  //         <Fragment>
  //           <div>isAuthenticated: {isAuthenticated}</div>
  //           {/*<div>user: {user}</div>*/}
  //           <div>user.name: {user.name}</div>
  //           {/*children*/}
  //         </Fragment>
  //       ) : (
  //         <Redirect
  //           to={{
  //             pathname: "/login",
  //             state: {from: location}
  //           }}
  //         />
  //       )
  //     }
  //   />
  // );

  return (
    <Route {...rest} >
      { children }
    </Route>
  )

};

export default PrivateRoute;
