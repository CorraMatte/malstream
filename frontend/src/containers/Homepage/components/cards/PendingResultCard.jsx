import {Card, CardBody, Progress} from "reactstrap";
import {useStatsTotalResults} from "../../../../queries/Stats";
import React from "react";
import LoadingSpinner from "../../../../shared/components/LoadingSpinner";
import _ from "lodash";


const PendingResultCard = () => {
  const {data, isIdle, isLoading, isError} = useStatsTotalResults('pending');
  const {
    data: dataTotal,
    isIdle: isIdleTotal,
    isLoading: isLoadingTotal,
    isError: isErrorTotal
  } = useStatsTotalResults();

  if (isError || isErrorTotal) {
    return <Card className={'dashboard__progressbar-card-with-errors'}><CardBody><h4>NOT AVAILABLE</h4></CardBody></Card>
  }

  return (
    <Card className={'h-auto'}>
      <CardBody className="dashboard__progressbar-card-body">
        {
          (isLoading || isIdle || isIdleTotal || isLoadingTotal) ? <LoadingSpinner /> :
            <>
              <div className="dashboard__progressbar-card-container">
                <h5 className="dashboard__progressbar-card-title dashboard__progressbar-card-title--red">
                  {data.count}
                </h5>
              </div>
              <h5 className="dashboard__progressbar-card-description">Analysis in pending</h5>
              <div className="progress-wrap progress-wrap--small progress-wrap--pink-gradient progress-wrap--rounded">
                <p className="dashboard__booking-card-progress-label progress__label">{_.floor(data.count / dataTotal.count * 100)}%</p>
                <Progress value={_.floor(data.count / dataTotal.count * 100)}/>
              </div>
            </>
        }
      </CardBody>
    </Card>
  )
}

export default PendingResultCard;
