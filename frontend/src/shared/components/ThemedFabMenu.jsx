import PropTypes from "prop-types";
import {Action, Fab} from "react-tiny-fab";
import React from "react";


const ThemedFabMenu = ({actions}) => {
  const mainButtonStyles = {
    backgroundColor: '#48c9cc',
  };
  const actionButtonStyles = {
    backgroundColor: '#232329',
    color: '#ffffff',
  }

  return (
    <Fab
      mainButtonStyles={mainButtonStyles}
      style={{bottom: 0, right: 0}}
      icon="+"
      event={'click'}
    >
      {
        actions.map((action, index) =>
          <Action
            style={actionButtonStyles}
            text={action.text}
            onClick={action.onClick}
            key={index}
          >
            {action.icon}
          </Action>
        )
      }
    </Fab>
  );
}


ThemedFabMenu.propTypes = {
  actions: PropTypes.array.isRequired
}

export default ThemedFabMenu;
