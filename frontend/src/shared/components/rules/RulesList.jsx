import {Col, Row} from "reactstrap";
import RuleCollapse from "./collapse/RuleCollapse";
import React from "react";
import PropTypes from "prop-types";
import LoadingSpinner from "../LoadingSpinner";
import ErrorHandler from "../ErrorHandler";
import RuleNotFoundRow from "./RuleNotFoundRow";


const RulesList = ({
  rules,
  ruleType = '',
  isIdleLoading = false,
  isError = false,
  error = null,
  highLightText = ''
}) => {
  if (isIdleLoading) {
    return <LoadingSpinner />
  }

  if (isError) {
    return <ErrorHandler error={error} />
  }
  
  if (!rules || rules.length === 0) {
    return <RuleNotFoundRow rule_type={ruleType} />
  }

  return (
    rules.map((rule, index) =>
      <Row className={'justify-content-center'} key={index}>
        <Col md={10}>
          <RuleCollapse rule={rule} highLightText={highLightText} key={rule.id} />
        </Col>
      </Row>
    )
  )
}


RulesList.propTypes = {
  rules: PropTypes.array.isRequired,
  ruleType: PropTypes.string,
  isIdleLoading: PropTypes.bool,
  isError: PropTypes.bool,
  highLightText: PropTypes.string,
  error: PropTypes.shape()
}


export default RulesList;
