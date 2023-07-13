import PropTypes from "prop-types";
import {Card, CardBody} from "reactstrap";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import {useStatsTotal} from "../../../../queries/Stats";
import React, {useMemo} from "react";
import GenericCardPieChart from "./GenericCardPieChart";


const GenericTotalRuleCard = ({section, color}) => {
  const {data, isIdle, isLoading, isError} = useStatsTotal(section);
  const {
    data: dataTotal,
    isIdle: isIdleTotal,
    isLoading: isLoadingTotal,
    isError: isErrorTotal
  } = useStatsTotal('rules');

  const dataPie = useMemo(() => (
    isLoading || isIdle || isIdleTotal || isLoadingTotal || isErrorTotal || isError
    ) ? [] : [
      {value: data.count, fill: color},
      {value: dataTotal.count - data.count, fill: '#eeeeee'}
    ],
    [isLoading, isIdle, isIdleTotal, isLoadingTotal, isErrorTotal, isError, data, dataTotal]
  );

  if (isError || isErrorTotal) {
    return <Card><CardBody><h4>NOT AVAILABLE</h4></CardBody></Card>
  }

  return (
    <Card>
      <CardBody className="dashboard__small-pie-chart-card">
        {
          (isLoading || isIdle || isIdleTotal || isLoadingTotal) ? <LoadingSpinner/> :
            <GenericCardPieChart dataPie={dataPie} dataName={data.name} dataCount={data.count} />
        }
      </CardBody>
    </Card>
  )

}

GenericTotalRuleCard.propTypes = {
  section: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired
}


export default GenericTotalRuleCard;