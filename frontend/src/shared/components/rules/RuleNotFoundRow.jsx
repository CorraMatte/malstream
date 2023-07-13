import PropTypes from "prop-types";
import {Card, CardBody, Col, Row} from "reactstrap";
import React from "react";


const RuleNotFoundRow = ({rule_type}) =>
  <Row className={'justify-content-center'}>
    <Col md={10}>
      <Card>
        <CardBody>
          <h2>No {rule_type.toUpperCase()} rules available</h2>
        </CardBody>
      </Card>
    </Col>
  </Row>


RuleNotFoundRow.propTypes = {
  rule_type: PropTypes.string.isRequired
}

export default RuleNotFoundRow;
