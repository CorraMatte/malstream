import React from "react";
import PropTypes from "prop-types";
import Collapse from "../../../../shared/components/Collapse";
import {Col, Row} from "reactstrap";
import ColorTagInlineBadge from "../../../../shared/components/badge/ColorTagInlineBadge";
import _ from "lodash";


const SigmaResultsCollapse = ({sigma_results}) => {

  return (
    <Collapse
      title={
        <>
          <span className={'span__font-monospace'} style={{lineHeight: '30px'}}>SIGMA</span>
          <span className={'float-right mr-3'}>
            <ColorTagInlineBadge
              color={'danger'}
              tag={`${sigma_results.length} CUSTOM RULES MATCHED`}
              style={{marginTop: '7px'}}
            />
            </span>
        </>
      }
      className={"with-shadow w-100"}
    >
      <Row>
        <Col>
          {
            _.chunk(sigma_results, 2).map((
              pair) => (
              <Row>
                <Col md={6}>
                  <h4>{pair[0].name}</h4>
                </Col>
                {
                  pair[1]?.name &&
                  <Col md={6}>
                    <h4>{pair[1].name}</h4>
                  </Col>
                }
              </Row>
            ))
          }
        </Col>
      </Row>
    </Collapse>
  )
}


SigmaResultsCollapse.propTypes = {
  sigma_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default SigmaResultsCollapse;
