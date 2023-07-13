import PropTypes from "prop-types";
import {Col, Row} from "reactstrap";
import MenuEntry from "../../../../shared/components/MenuEntry";
import RuleDetailModal from "./components/RuleDetailModal";
import React from "react";
import paths from "../../../../config/paths";
import {useHistory} from "react-router-dom";


const SuricataSections = ({suricata_results}) => {
  const history = useHistory();

  return (
    suricata_results.map((suricata_result, index) => (
      <Row key={index} className={'mx-0'}>
        <div className="custom_card__container w-100 mx-0 px-4">
          <div className="card__title">
            <h4>
              {
                suricata_result.rule ?
                  <a onClick={() => history.push(`${paths.rulesPath}/${suricata_result.rule.id}`)}>
                    <u>{suricata_result.signature}</u>
                  </a> : <>{suricata_result.signature}</>
              }

              {suricata_result.rule && <RuleDetailModal rule={suricata_result.rule} />}
            </h4>
          </div>
          <Row>
            <Col md={4}>
              <MenuEntry title={'srcip'} value={suricata_result.srcip}/>
              <MenuEntry title={'dstip'} value={suricata_result.dstip}/>
              <MenuEntry title={'severity'} value={suricata_result.severity}/>
              <MenuEntry title={'sid'} value={suricata_result.sid}/>
            </Col>
            <Col md={4}>
              <MenuEntry title={'srcport'} value={suricata_result.srcport}/>
              <MenuEntry title={'dstport'} value={suricata_result.dstport}/>
              <MenuEntry title={'gid'} value={suricata_result.gid}/>
              <MenuEntry title={'rev'} value={suricata_result.rev}/>
            </Col>
            <Col md={4}>
              <MenuEntry title={'timestamp'} value={suricata_result.timestamp}/>
              <MenuEntry title={'category'} value={suricata_result.category}/>
            </Col>
          </Row>
        </div>
      </Row>
    ))
  )
}


SuricataSections.propTypes = {
  suricata_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default SuricataSections;
