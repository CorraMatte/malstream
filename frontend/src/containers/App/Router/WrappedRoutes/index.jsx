import React from 'react';
import {Switch} from "react-router-dom";
import PrivateRoute from "../../../../shared/components/router/PrivateRoute";
import Layout from '../../../Layout/index';
import NotFound404 from "../../../DefaultPage/404";
import paths from "../../../../config/paths";
import Homepage from "../../../Homepage";
import Rules from "../../../Rules";
import Indicator from "../../../Indicator";
import EditRules from "../../../EditRules";
import RetroHunt from "../../../RetroHunt";
import AddRules from "../../../AddRules";
import RuleDetails from "../../../RuleDetails";


const WrappedRoutes = () => (
  <div>
    <Layout />
    <div className="container__wrap">
      <Switch>
        <PrivateRoute path={paths.homePath} exact>
          <Homepage />
        </PrivateRoute>

        <PrivateRoute path={paths.rulesPath} exact>
          <Rules />
        </PrivateRoute>

        <PrivateRoute path={paths.resultPath}>
          <Indicator />
        </PrivateRoute>

        <PrivateRoute path={paths.editRuleIdPath} exact>
          <EditRules />
        </PrivateRoute>

        <PrivateRoute path={paths.addRuleTypePath} exact>
          <AddRules />
        </PrivateRoute>

        <PrivateRoute path={paths.retroHuntPath} exact>
          <RetroHunt />
        </PrivateRoute>

        <PrivateRoute path={paths.ruleDetailPath} exact>
          <RuleDetails />
        </PrivateRoute>

        <PrivateRoute path="*">
          <NotFound404 />
        </PrivateRoute>
      </Switch>
    </div>
  </div>
);


export default WrappedRoutes;
