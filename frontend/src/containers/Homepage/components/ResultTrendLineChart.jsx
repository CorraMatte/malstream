import React from 'react';
import {useStatsResultTrend} from "../../../queries/Stats";
import LineChart from "../../../shared/components/charts/ThemedLineChart";


const IndicatorTrendLineChart = () => {
  const {data, isIdle, isLoading, isError} = useStatsResultTrend(7);

  return (
    <LineChart
      data={data?.reverse()}
      dataKey={"count"}
      title={'Results Trend'}
      dataName={'Analysis per Hour'}
      isLoading={isIdle || isLoading}
      isError={isError}
    />
  )

}

export default IndicatorTrendLineChart;
