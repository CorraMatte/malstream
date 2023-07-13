import {Card, CardBody} from "reactstrap";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import {useStatsTotal} from "../../../../queries/Stats";
import React, {useMemo} from "react";
import GenericCardPieChart from "./GenericCardPieChart";


const GenericTotalRuleCard = () => {
  const {data, isIdle, isLoading, isError } = useStatsTotal('rules');

  const dataPie = useMemo(() => (isLoading || isIdle || isError) ? [] : [
      {value: data.count, fill: '#70bbfd'}
    ],
    [isLoading, isIdle, isError, data]
  );

  if (isError) {
    return <Card><CardBody><h4>NOT AVAILABLE</h4></CardBody></Card>
  }

  return (
    <Card>
      <CardBody className="dashboard__small-pie-chart-card">
        {
          (isLoading || isIdle) ? <LoadingSpinner/> :
            <GenericCardPieChart dataPie={dataPie} dataName={data.name} dataCount={data.count} />
        }
      </CardBody>
    </Card>
  )

}

GenericTotalRuleCard.propTypes = {
}


export default GenericTotalRuleCard;