import React from 'react';
import {Route, Switch} from 'react-router-dom';
import MainWrapper from '../MainWrapper';
import WrappedRoutes from './WrappedRoutes';


const Router = () => {

  return (
  <MainWrapper>
    <main>
      <Switch>
        <Route path="/" component={WrappedRoutes} />
      </Switch>
    </main>
  </MainWrapper>)
};

export default Router;
