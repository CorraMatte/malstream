import {Card, CardBody, Col, Container, Row} from "reactstrap";
import {useHistory, useParams} from "react-router-dom";
import {useRuleByIdQuery} from "../../queries/RuleByID";
import LoadingSpinner from "../../shared/components/LoadingSpinner";
import ErrorHandler from "../../shared/components/ErrorHandler";
import React from "react";
import CopyIconToClipboard from "../../shared/components/icons/CopyIconToClipboard";
import RuleResults from "./compoonents/RuleResults";


const RuleDetails = () => {
  const {RuleId: ruleId} = useParams();
  const history = useHistory();
  const {data, isIdle, isLoading, isError, error} = useRuleByIdQuery(ruleId);


  if (isLoading || isIdle) {
    return <LoadingSpinner/>
  }

  if (isError) {
    return <ErrorHandler error={error}/>
  }


  return (
    <Container>
      <div className={'div__sticky-top'}>
        <Row>
          <Col md={12} className={'mx-auto'}>
            <h3 className="page-title" style={{textTransform: 'none'}}>Results related to <b>"{data.title}" rule</b>
            </h3>
          </Col>
        </Row>
      </div>

      <Row>
        <Col md={6}>
          <h5><a onClick={() => history.goBack()}><u>Go back to rules...</u></a></h5>
        </Col>
      </Row>

      <Card>
        <CardBody className={'rules__card-body rules__col-rule-body mx-0 mt-3'}>
          <CopyIconToClipboard
            value={data.body}
            copiedMessage={data.title}
            style={{fill: '#ffffff', float: 'right'}}
          />
          <pre className={'pre--rules'}>{data.body}</pre>
        </CardBody>
      </Card>

      <RuleResults ruleId={ruleId} />

    </Container>
  )
}

export default RuleDetails;
