import React, {useCallback, useState} from "react";
import PropTypes from "prop-types";
import {Card, Collapse} from "reactstrap";
import classNames from "classnames";
import RetroHuntTaskHeader from "./RetroHuntTaskHeader";
import RetroHuntTaskBody from "./RetroHuntTaskBody";


const RetroHuntTaskDetailCard = ({task}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <Card>
      <div className={classNames({['card-body__priority-' + task.priority]: true})}>
        <RetroHuntTaskHeader task={task} toggle={toggle} />
        <Collapse isOpen={isOpen}>
          <RetroHuntTaskBody task={task} />
        </Collapse>
      </div>
    </Card>
  )
}

RetroHuntTaskDetailCard.propTypes = {
  task: PropTypes.shape().isRequired
};

export default RetroHuntTaskDetailCard;
