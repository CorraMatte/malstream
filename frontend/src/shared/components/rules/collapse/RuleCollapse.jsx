import {Card, Collapse} from "reactstrap";
import React, {useCallback, useState} from "react";
import RuleCollapseHeader from "./RuleCollapseHeader";
import PropTypes from "prop-types";
import RuleCollapseBody from "./RuleCollapseBody";


const RuleCollapse = ({rule, highLightText = ''}) => {
  const [isOpen, setIsOpen] = useState(false);
  const toggle = useCallback(() => setIsOpen(!isOpen), [isOpen]);

  return (
    <Card>
        <RuleCollapseHeader
          toggle={toggle}
          rule={rule}
          isOpen={isOpen}
        />
        <Collapse isOpen={isOpen}>
          <RuleCollapseBody
            ruleId={rule.id}
            highLightText={highLightText}
            isOpen={isOpen}
          />
        </Collapse>
    </Card>
  )
}


RuleCollapse.propTypes = {
  rule: PropTypes.shape().isRequired,
  highLightText: PropTypes.string
}

export default RuleCollapse;