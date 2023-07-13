import PropTypes from "prop-types";
import {Col, Row} from "reactstrap";
import RuleDetailModal from "./components/RuleDetailModal";
import MenuEntry from "../../../../shared/components/MenuEntry";
import React, {Fragment} from "react";
import ResultDetailModal from "./components/ResultDetailModal";
import {ColorTagInlineBadgeList} from "../../../../shared/components/badge/BadgeLists";
import paths from "../../../../config/paths";
import {useHistory} from "react-router-dom";

const _ = require('lodash')


const YaraSections = ({yara_results}) => {
  const history = useHistory();

  return (
    yara_results.map((yara_result, index) => (
      <Row key={index} className={'mx-0'}>
        <div className="custom_card__container w-100 mx-0 px-4">
          <div className="card__title mb-3">
            <h4>
              {
                yara_result.rule ?
                  <a onClick={() => history.push(`${paths.rulesPath}/${yara_result.rule.id}`)}><u>{yara_result.name}</u></a>
                : <>{yara_result.name}</>
              }
              {yara_result.rule && <RuleDetailModal rule={yara_result.rule}/>}
              {yara_result.meta &&
                <ResultDetailModal title={`${yara_result.name} event details`} raw_json={yara_result.meta}/>}
            </h4>
            <h4 className="subhead">Detected in: <b>{yara_result.rule_source_match}</b></h4>
          </div>

          <Row>
            <Col md={6}>
              {
                yara_result.addresses &&
                <MenuEntry title={'addresses'} value={
                  _.entries(yara_result.addresses).map((match) =>
                    <Fragment key={`${match[0]}${match[1]}`}>{match[0]}: {match[1]} <br /></Fragment>)
                }/>
              }
              {yara_result.path && <MenuEntry title={'path'} value={yara_result.path.slice(17)}/>}
            </Col>
            <Col md={4}>
              {yara_result.source && <MenuEntry title={'source'} value={yara_result.source}/>}
            </Col>
            <Col md={12}>
              {
                yara_result.strings.length > 0 &&
                  <MenuEntry
                    title={'strings'}
                    value={<ColorTagInlineBadgeList items={yara_result.strings} color={'primary'}/>}
                    valueStyle={{whiteSpace: 'break-spaces'}}
                  />
              }
            </Col>
          </Row>
        </div>
      </Row>
    ))
  )
}


YaraSections.propTypes = {
  yara_results: PropTypes.arrayOf(PropTypes.object).isRequired
}


export default YaraSections;
