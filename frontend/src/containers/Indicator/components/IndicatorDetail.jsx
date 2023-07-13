import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import {Col, Nav, NavItem, NavLink, Row, TabContent, TabPane} from "reactstrap";
import classnames from "classnames";
import AlertBanner from "../../../shared/components/AlertBanner";
import _ from "lodash";
import {RESULT_SOURCES_LABEL} from "../../../shared/helpers/rules";
import {useIndicatorBySha256Query} from "../../../queries/IndicatorBySha256";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import IndicatorErrorHandler from "./IndicatorErrorHandler";
import OsintSections from "./IndicatorDetailSections/OsintSections";
import YaraSections from "./IndicatorDetailSections/YaraSections";
import SigmaSections from "./IndicatorDetailSections/SigmaSections";
import SuricataSections from "./IndicatorDetailSections/SuricataSections";
import ErrorHandler from "../../../shared/components/ErrorHandler";
import paths from "../../../config/paths";
import {useHistory} from "react-router-dom";
import DeleteResultModal from "./IndicatorDetailSections/components/DeleteResultModal";
import ResubmitIndicatorResultModal from "./IndicatorDetailSections/components/ResubmitIndicatorResultModal";
import {apiUrl} from "../../../config/api";
import DownloadFileIcon from "../../../shared/components/icons/DownloadFileIcon";


const IndicatorDetail = ({searchTerm}) => {
  const sections = RESULT_SOURCES_LABEL.map((label) => _.toUpper(label));
  const {data, isIdle, isLoading, isError, error} = useIndicatorBySha256Query(_.toLower(searchTerm));
  const [indicator, setIndicator] = useState({});
  const history = useHistory();
  const [activeTab, setActiveTab] = useState(0);
  const toggleTab = (tab) => {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  };

  useEffect(() => {
    if (!isLoading && !isIdle && !isError && data) {
      setIndicator(data);
    }
  }, [data, isIdle, isLoading, isError]);

  if (isLoading || isIdle) {
    return <LoadingSpinner/>
  }

  if (isError) {
    const errorCode = error?.request?.status;
    if (errorCode !== 404 || errorCode !== 400) {
      return <IndicatorErrorHandler error={error}/>
    } else {
      return <ErrorHandler error={error}/>
    }
  }

  if (!indicator.enrichment && !indicator.sandbox) {
    return (
      <>
        <Row>
          <Col>
            <h5><a onClick={() => history.push(`${paths.resultPath}?value=`)}><u>Go back to results...</u></a></h5>
          </Col>
        </Row>
        <Row>
          <Col className={'mt-3'}>
            <AlertBanner status={'warning'} className={'mb-3'} message={'The analysis is still running'}/>
          </Col>
        </Row>
      </>
    )
  }


  return (
    <>
      <Row>
        <Col md={6}>
          <h5><a onClick={() => history.push(`${paths.resultPath}?value=`)}><u>Go back to results...</u></a></h5>
        </Col>
        <Col md={6} className={'text-right'}>
          <DownloadFileIcon
            url={`${apiUrl}/indicators/${indicator.file.hash.sha256}/download`}
            filename={indicator.file.hash.sha256}
            size={26}
          />
          <ResubmitIndicatorResultModal sha256={indicator.file.hash.sha256} />
          <DeleteResultModal sha256={indicator.file.hash.sha256} />
        </Col>
      </Row>
      <Row>
        <Col className={'mt-3 px-0'}>
          {
            (indicator.enrichment && !indicator.sandbox && indicator.is_supported_by_sandbox) ?
              <Col className={'mt-3'}>
                <AlertBanner status={'warning'} className={'mb-3'} message={'Sandbox analysis is still running'}/>
              </Col> :
              (!indicator.enrichment && indicator.sandbox) &&
              <Col className={'mt-3'}>
                <AlertBanner status={'warning'} className={'mb-3'} message={'Enrichment analysis is still running'}/>
              </Col>
          }
          <div className="tabs tabs--bordered-bottom">
            <div className="tabs__wrap">
              <Nav tabs>
                {
                  sections.map((sec, index) =>
                    <NavItem key={sec}>
                      <NavLink
                        className={classnames({active: activeTab === index})}
                        onClick={() => toggleTab(index)}
                        key={index}
                        style={{textDecoration: 'none'}}
                      >{sec} ({indicator[_.toLower(sec)]?.length})</NavLink>
                    </NavItem>
                  )
                }
              </Nav>
              <TabContent activeTab={activeTab}>
                <TabPane tabId={0}>
                  <YaraSections yara_results={indicator.yara}/>
                </TabPane>
                <TabPane tabId={1}>
                  <SigmaSections sigma_results={indicator.sigma}/>
                </TabPane>
                <TabPane tabId={2}>
                  <SuricataSections suricata_results={indicator.suricata}/>
                </TabPane>
                <TabPane tabId={3}>
                  <OsintSections osint_results={indicator.osint}/>
                </TabPane>
              </TabContent>
            </div>
          </div>
        </Col>
      </Row>
    </>
  )
}

IndicatorDetail.propTypes = {
  searchTerm: PropTypes.string.isRequired
}

export default IndicatorDetail;
