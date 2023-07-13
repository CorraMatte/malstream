import React from "react";
import PropTypes from "prop-types";
import Collapse from "../../../../shared/components/Collapse";
import {Col, Row} from "reactstrap";
import ColorTagInlineBadge from "../../../../shared/components/badge/ColorTagInlineBadge";
import {ColorTagInlineBadgeList} from "../../../../shared/components/badge/BadgeLists";


const OsintResultsCollapse = ({osint_results}) => {

  return (
    <Collapse
      title={
        <>
          <span className={'span__font-monospace'} style={{lineHeight: '30px'}}>OSINT</span>
          <span className={'float-right mr-3'}>
            <ColorTagInlineBadge
              color={'secondary'}
              tag={`${osint_results.length} RESULTS`}
              style={{marginTop: '7px'}}
            />
            </span>
        </>
      }
      className={"with-shadow w-100"}
    >
      {
        osint_results.map((result, index) => (
          <Row className={'mt-1'} key={index}>
            <Col md={4}><h5 className={'bold-text'}>{result.source}</h5></Col>
            <Col md={8}>
              <ColorTagInlineBadgeList color={'primary'} items={result.matches} />
            </Col>
          </Row>
        ))
      }
    </Collapse>
  )
}


OsintResultsCollapse.propTypes = {
  osint_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default OsintResultsCollapse;
