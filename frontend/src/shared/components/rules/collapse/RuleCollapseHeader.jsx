import React, {Fragment} from "react";
import {Col, Row} from "reactstrap";
import PropTypes from "prop-types";
import {formatDateUTCtoYearMonthDay} from "../../../helpers/date";
import ChevronDownIcon from "mdi-react/ChevronDownIcon";
import ChevronUpIcon from "mdi-react/ChevronUpIcon";
import paths from "../../../../config/paths";
import {useHistory} from "react-router-dom";
import ColorTagInlineBadge from "../../badge/ColorTagInlineBadge";
import RetroHuntTaskModal from "../../../../containers/Rules/components/RetroHuntTaskModal";
import RetroHuntTaskUploadModal from "../../../../containers/Rules/components/RetroHuntTaskUploadModal";
import RetroSigmaTaskUploadModal from "../../../../containers/RetroSigma";


const RuleCollapseHeader = ({toggle, rule, isOpen}) => {
  const history = useHistory();

  return (
    <div className={'card-header__events'}>
      <Row style={{minHeight: '80px'}}>
        <Col md={8}>
          <div className={"card__title__events"}>
            <h4 className={'bold-text'}>
              <a style={{textDecoration: 'underline'}}
                 onClick={() => history.push(`${paths.rulesPath}/${rule.id}`)}
              >{rule.title}</a>
            </h4>
            <p className={'subhead'}>Created on {formatDateUTCtoYearMonthDay(rule.timestamp)}</p>
          </div>
        </Col>
        <Col md={4} className={'d-flex justify-content-end'}>
          <span className={'position-absolute'} style={{right: '15px'}}>
            <ColorTagInlineBadge color={rule.number_results === 0 ? 'primary' : 'danger'} tag={`${rule.number_results} RESULTS`}/>

          </span>
          {
            rule.type === 'yara' ?
              rule.retrohunt_task_id ?
                <RetroHuntTaskModal task_id={rule.retrohunt_task_id} ruleId={rule.id}/>
                : <RetroHuntTaskUploadModal rule={rule}/>
              : <Fragment/>
          }
          {rule.type === 'sigma' && <RetroSigmaTaskUploadModal rule={rule}/>}
          {
            isOpen ?
              <ChevronUpIcon
                size={24}
                style={{fill: '#ffffff'}}
                className={'border-hover-white mx-0 my-auto'}
                onClick={toggle}
              /> :
              <ChevronDownIcon
                size={24}
                style={{fill: '#ffffff'}}
                className={'border-hover-white mx-0 my-auto'}
                onClick={toggle}
              />
          }
        </Col>
      </Row>
    </div>
  )
}


RuleCollapseHeader.propTypes = {
  toggle: PropTypes.func.isRequired,
  rule: PropTypes.shape().isRequired
}

export default RuleCollapseHeader;
