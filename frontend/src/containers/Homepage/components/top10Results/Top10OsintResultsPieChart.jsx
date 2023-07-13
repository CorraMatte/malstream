import PieChartMultipleItems from "../../../../shared/components/charts/PieChartMultipleItems";
import React from "react";
import {useStatsTopResults} from "../../../../queries/Stats";
import {OSINT_LABEL} from "../../../../shared/helpers/rules";


const Top10OsintResultsPieChart = () => {
  const {
    data: dataOsint,
    isIdle: isIdleOsint,
    isLoading: isLoadingOsint,
    isError: isErrorOsint
  } = useStatsTopResults(OSINT_LABEL);

  return (
    <PieChartMultipleItems
      title={'Top 10 OSINT results'}
      data={dataOsint}
      isLoading={isLoadingOsint || isIdleOsint}
      isError={isErrorOsint}
      dataKey={'count'}
      classNamePie={'dashboard__chart-pie--indicators'}
    />
  )
}


export default Top10OsintResultsPieChart;
