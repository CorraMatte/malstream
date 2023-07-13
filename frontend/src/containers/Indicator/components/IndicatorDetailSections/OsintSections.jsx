import React from "react";
import PropTypes from "prop-types";
import {Card, CardBody, Col, Row} from "reactstrap";
import {ColorTagInlineBadgeList} from "../../../../shared/components/badge/BadgeLists";


const OsintSections = ({osint_results}) =>
  <Row className={'mx-0'}>
      {
        osint_results.map((osint_result, index) => (
          <Col md={6} xs={12} xl={3} lg={4} key={index}>
            <Card className={'h-auto'}>
              <CardBody>
                <div className={"card__title mb-0"}>
                  <h4 className="bold-text">{osint_result.source}</h4>
                </div>
                <Row className={'justify-content-end pr-2'}>
                  <ColorTagInlineBadgeList
                    color={'primary'}
                    items={osint_result.matches}
                    style={{marginTop: '10px', maxWidth: '360px', whiteSpace: 'initial'}}
                    size={'sm'}
                  />
                </Row>
              </CardBody>
            </Card>
          </Col>
        ))
      }
    </Row>


OsintSections.propTypes = {
  osint_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default OsintSections;
