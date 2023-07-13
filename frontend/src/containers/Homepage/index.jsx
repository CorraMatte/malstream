import React from "react";
import {Col, Container, Row} from "reactstrap";
import {SIGMA_LABEL, SURICATA_LABEL, YARA_LABEL} from "../../shared/helpers/rules";
import Top10OsintResultsPieChart from "./components/top10Results/Top10OsintResultsPieChart";
import Top10YaraResultsLineBar from "./components/top10Results/Top10YaraResultsLineBar";
import Top10SuricataResultsTable from "./components/top10Results/Top10SuricataResultsTable";
import Top10SigmaResultsTable from "./components/top10Results/Top10SigmaResultsTable";
import GenericTotalRuleCard from "./components/cards/GenericTotalRuleCard";
import TotalRuleCard from "./components/cards/TotalRuleCard";
import TotalResultCard from "./components/cards/TotalResultCard";
import PendingResultCard from "./components/cards/PendingResultCard";
import FinishedResultCard from "./components/cards/FinishedResultCard";
import IndicatorTrendLineChart from "./components/ResultTrendLineChart";
import OsintTopResultsTrend from "./components/OsintTopResultsTrend";
import NotSupportedResultCard from "./components/cards/NotSupportedResultCard";
import DailyAvgResultCard from "./components/cards/DailyAvgResultCard";
import HourAvgResultCard from "./components/cards/HourAvgResultCard";
import LastDayTotalResultCard from "./components/cards/LastDayTotalResultCard";
import LastHourTotalResultCard from "./components/cards/LastHourTotalResultCard";


const Homepage = () => {

  return (
    <Container className={'dashboard'}>
      <Row className={'mb-5'}>
        <h1>Malstream engine statistics</h1>
      </Row>

      <Row>
        <Col md={9}>
          <Row>
            <Col md={12}>
              <IndicatorTrendLineChart/>
            </Col>
          </Row>
          <Row>
            <Col md={3}>
              <DailyAvgResultCard/>
            </Col>
            <Col md={3}>
              <HourAvgResultCard/>
            </Col>
            <Col md={3}>
              <LastDayTotalResultCard/>
            </Col>
            <Col md={3}>
              <LastHourTotalResultCard/>
            </Col>
          </Row>

        </Col>
        <Col md={3}>
          <TotalResultCard/>
          <FinishedResultCard/>
          <PendingResultCard/>
          <NotSupportedResultCard/>
        </Col>
      </Row>


      <Row className={'mb-5'}>
        <h3>Rules resume</h3>
      </Row>
      <Row>
        <Col md={3}>
          <GenericTotalRuleCard
            section={SURICATA_LABEL}
            color={'#ff4861'}
          />
        </Col>
        <Col md={3}>
          <GenericTotalRuleCard
            section={SIGMA_LABEL}
            color={'#f6da6e'}
          />
        </Col>
        <Col md={3}>
          <GenericTotalRuleCard
            section={YARA_LABEL}
            color={'#4ce1b6'}
          />
        </Col>
        <Col md={3}>
          <TotalRuleCard/>
          />
        </Col>
      </Row>

      <Row className={'mb-5'}>
        <h3>Top 10 results</h3>
      </Row>
      <Row>
        <Col md={12} xl={6}>
          <Top10OsintResultsPieChart/>
        </Col>
        <Col md={12} xl={6}>
          <Top10SigmaResultsTable/>
        </Col>
      </Row>

      <Row>
        <Col md={12}>
          <OsintTopResultsTrend/>
        </Col>
      </Row>

      <Row>
        <Col md={12} xl={6}>
          <Top10SuricataResultsTable/>
        </Col>
        <Col md={12} xl={6}>
          <Top10YaraResultsLineBar/>
        </Col>
      </Row>

    </Container>
  )
}


export default Homepage;
