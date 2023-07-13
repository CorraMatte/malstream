import {Card, CardBody, Row} from "reactstrap";
import PropTypes from "prop-types";
import React from "react";
import {formatDateUTCtoYearMonthDayTime} from "../../../shared/helpers/date";
import {useHistory} from "react-router-dom";
import paths from "../../../config/paths";
import ColorTagInlineBadge from "../../../shared/components/badge/ColorTagInlineBadge";
import YaraResultsCollapse from "./collapse/YaraResultsCollapse";
import OsintResultsCollapse from "./collapse/OsintResultsCollapse";
import SuricataResultsCollapse from "./collapse/SuricataResultsCollapse";
import SigmaResultsCollapse from "./collapse/SigmaResultsCollapse";


const IndicatorResumeResultsCard = ({indicator}) => {
  const history = useHistory();

  return (
    <Card>
      <CardBody>
        <div className="card__title">
          <h4 className="bold-text">
            <a onClick={() => history.push(`${paths.resultPath}?value=${indicator.file.hash.sha256}`)}>
              <u>{indicator.file.hash.sha256}</u>
            </a>
            <span className={'float-right text-right'}>
              {
                indicator.sandbox ?
                  <ColorTagInlineBadge color={'success'} tag={'SANDBOX: DONE'} />
                  : indicator.is_supported_by_sandbox ?
                    <ColorTagInlineBadge color={'warning'} tag={'SANDBOX: PENDING'} /> :
                    <ColorTagInlineBadge color={'danger'} tag={'SANDBOX: NOT SUPPORTED'} />
              }
              {
                indicator.enrichment ?
                  <ColorTagInlineBadge  color={'success'} tag={'ENRICHMENT: DONE'} style={{display: 'block', marginTop: '3px'}} />
                  : <ColorTagInlineBadge color={'warning'} tag={'ENRICHMENT: PENDING'} style={{display: 'block', marginTop: '3px'}} />
              }
              {
                (indicator.osint.length === 0 && indicator.sandbox && indicator.enrichment) &&
                <ColorTagInlineBadge color={'danger'} tag={'OSINT: NOT FOUND'} style={{display: 'block', marginTop: '3px'}} />
              }
            </span>
          </h4>
          <h4 className="subhead">{indicator.file.name}</h4>
          <h4 className="subhead">
            Created on {formatDateUTCtoYearMonthDayTime(indicator.created_dt)}<br />
          </h4>
        </div>
        <Row>
          {indicator.yara.length > 0 && <YaraResultsCollapse yara_results={indicator.yara} />}
          {indicator.sigma.length > 0 && <SigmaResultsCollapse sigma_results={indicator.sigma} />}
          {indicator.suricata.length > 0 && <SuricataResultsCollapse suricata_results={indicator.suricata} />}
          {indicator.osint.length > 0 && <OsintResultsCollapse osint_results={indicator.osint} />}
        </Row>
      </CardBody>
    </Card>
  )
}

IndicatorResumeResultsCard.propTypes = {
  indicator: PropTypes.shape.isRequired
}

export default IndicatorResumeResultsCard;
