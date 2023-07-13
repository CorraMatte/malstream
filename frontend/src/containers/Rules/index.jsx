import React, {useEffect, useState} from "react";
import {Button, Col, Container, Row} from "reactstrap";
import SyncRuleModal from "./components/SyncRuleModal";
import {RULE_TYPES_LABEL, SIGMA_LABEL, SURICATA_LABEL, YARA_LABEL} from "../../shared/helpers/rules";
import {paramsToObject, useQueryParams} from "../../shared/components/router/QueryNavigationHelpers";
import {useHistory} from "react-router-dom";
import paths from "../../config/paths";
import SearchBarOnEnter from "../../shared/components/form/SearchBarOnEnter";
import {useAllRulesQuery} from "../../queries/AllRules";
import RulesList from "../../shared/components/rules/RulesList";
import CreateRuleFabMenu from "./components/CreateRuleFabMenu";
import {useAllResultsQuery} from "../../queries/AllRuleCounts";


export const SECT_SEARCH_RULE = "search";


const Rules = () => {
  const [overview, setOverview] = useState(SECT_SEARCH_RULE);
  const params = paramsToObject(useQueryParams().entries());
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState('');
  const [currentRuleType, setCurrentRuleType] = useState(params?.rule_type);
  const {data, isIdle, isLoading, isError, error} = useAllRulesQuery(searchTerm, currentRuleType);
  const queries = useAllResultsQuery(['', YARA_LABEL, SIGMA_LABEL, SURICATA_LABEL]);

  const changeSection = (rule_type = '') => {
    setSearchTerm('');
    if (rule_type !== '') {
      history.replace(`${paths.rulesPath}?rule_type=${rule_type}`);
    } else {
      history.replace(paths.rulesPath);
    }
  }

  useEffect(() => {
    const rule_type = params?.rule_type;
    if (rule_type) {
      setCurrentRuleType(rule_type);
      setOverview(rule_type);
    } else {
      setCurrentRuleType('');
      setOverview(SECT_SEARCH_RULE);
    }
  }, [params]);


  return (
    <Container>
      <Row className={'justify-content-center'}>
        <Col md={10}>
          <Row>
            <Col>
              <SearchBarOnEnter
                searchPlaceholder={'Search a rule and press enter'}
                setSearch={setSearchTerm}
                searchTerm={searchTerm}
                withSearchButton
              />
            </Col>

          </Row>

          <Row className={'mt-4'}>
            <Col>
              <Button
                className="rounded ml-0 mr-1" size="sm" outline
                active={overview === SECT_SEARCH_RULE}
                onClick={() => changeSection()}
              >ALL {queries[0].data?.total ? `(${queries[0].data.total})` : ''}</Button>
              <Button
                className="rounded mx-1" size="sm" outline
                active={currentRuleType === YARA_LABEL}
                onClick={() => changeSection(YARA_LABEL)}
              >{YARA_LABEL} {queries[1].data?.total ? `(${queries[1].data.total})` : ''}</Button>
              <Button
                className="rounded mx-1" size="sm" outline
                active={currentRuleType === SIGMA_LABEL}
                onClick={() => changeSection(SIGMA_LABEL)}
              >{SIGMA_LABEL} {queries[2].data?.total ? `(${queries[2].data.total})` : ''}</Button>
              <Button
                className="rounded mx-1" size="sm" outline
                active={currentRuleType === SURICATA_LABEL}
                onClick={() => changeSection(SURICATA_LABEL)}
              >{SURICATA_LABEL} {queries[3].data?.total ? `(${queries[3].data.total})` : ''}</Button>

              {
                RULE_TYPES_LABEL.includes(overview) &&
                <SyncRuleModal ruleType={overview}/>
              }

            </Col>
          </Row>

        </Col>
      </Row>

      <RulesList
        rules={data}
        ruleType={currentRuleType}
        isIdleLoading={isIdle || isLoading}
        isError={isError}
        error={error}
        highLightText={searchTerm}
      />

      <CreateRuleFabMenu />

    </Container>
  )
}


export default Rules;
