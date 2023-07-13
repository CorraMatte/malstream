import React from "react";
import PropTypes from "prop-types";
import {CardBody, Col, Row} from "reactstrap";
import RetroHuntTaskYaraModal from "./RetroHuntTaskYaraModal";
import RetroHuntTasksPaginatedTable from "../../../shared/components/retrohunt/RetroHuntTasksPaginatedTable";


const RetroHuntTaskBody = ({task}) =>
  <CardBody>
    <Row>
      <Col md={12} xs={12}>
        <RetroHuntTaskYaraModal yara={task.yara} ruleName={task.rule_name}/>
        <RetroHuntTasksPaginatedTable task_files_matched={task.files_matched} task_id={task.id} />
      </Col>
    </Row>
  </CardBody>


RetroHuntTaskBody.propTypes = {
  task: PropTypes.shape().isRequired
}

export default RetroHuntTaskBody;