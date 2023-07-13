import React from "react";
import PropTypes from "prop-types";
import Collapse from "../../../../shared/components/Collapse";
import {Col, Row} from "reactstrap";
import ColorTagInlineBadge from "../../../../shared/components/badge/ColorTagInlineBadge";
import _ from "lodash";


const SuricataResultsCollapse = ({suricata_results}) => {
  const platform_rule_match = _.filter(suricata_results, (rule) => rule.exists_in_platform).length;

  return (
    <Collapse
      title={
        <>
          <span className={'span__font-monospace'}>SURICATA</span>
          <span className={'float-right mr-3'}>
            {
              platform_rule_match > 0 &&
              <ColorTagInlineBadge
                color={'danger'}
                tag={`${platform_rule_match} CUSTOM RULES MATCHED`}
                style={{marginRight: '7px'}}
              />
            }
            <ColorTagInlineBadge
              color={'secondary'}
              tag={`${suricata_results.length} RESULTS`}
            />
            </span>
        </>
      }
      className={"with-shadow w-100"}
    >
      <Row>
        <Col>
          {
            _.chunk(suricata_results, 2).map(
              (pair, index) => (
                <Row key={index}>
                  <Col md={6}>
                    <h4 style={{color: pair[0].exists_in_platform ? '#ff4861' : 'inherit'}}>{pair[0].signature}</h4>
                  </Col>
                  {
                    pair[1]?.signature &&
                    <Col md={6}>
                      <h4 style={{color: pair[1].exists_in_platform ? '#ff4861' : 'inherit'}}>{pair[1].signature}</h4>
                    </Col>
                  }
                </Row>
              )
            )
          }
        </Col>
      </Row>
    </Collapse>
  )
}


SuricataResultsCollapse.propTypes = {
  suricata_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default SuricataResultsCollapse;
