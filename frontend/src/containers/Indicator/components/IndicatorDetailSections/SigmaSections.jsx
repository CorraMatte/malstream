import PropTypes from "prop-types";
import {CardBody, Col, Row} from "reactstrap";
import React from "react";
import RuleDetailModal from "./components/RuleDetailModal";
import ResultDetailModal from "./components/ResultDetailModal";
import CopyIconToClipboard from "../../../../shared/components/icons/CopyIconToClipboard";
import {useHistory} from "react-router-dom";
import paths from "../../../../config/paths";


const SigmaSections = ({sigma_results}) => {
  const history = useHistory();

  return (
    sigma_results.map((sigma_result, index) => (
      <Row key={index} className={'mx-0'}>
        <div className="custom_card__container w-100 mx-0 px-4">
          <div className="card__title">
            <h4>
              <a onClick={() => history.push(`${paths.rulesPath}/${sigma_result.id}`)}><u>{sigma_result.name}</u></a>
              {sigma_result.rule && <RuleDetailModal rule={sigma_result.rule} />}
              <ResultDetailModal
                raw_json={sigma_result.raw}
                title={`${sigma_result.name} event details`}
              />
            </h4>
            <h4 className="subhead">{sigma_result.description}</h4>
          </div>
          <Row>
            <Col>
              <h5>Eventlog raw message</h5>
              <CardBody className={'rules__card-body rules__col-rule-body mx-0 my-1 h-auto'}>
                <CopyIconToClipboard
                  value={sigma_result.raw.message}
                  copiedMessage={'eventlog message'}
                  style={{fill: '#ffffff', float: 'right'}}
                />
                <pre className={'pre--rules'}>{sigma_result.raw.message}</pre>
              </CardBody>
            </Col>
          </Row>
        </div>
      </Row>
    )
  )
  )
}


SigmaSections.propTypes = {
  sigma_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default SigmaSections;
