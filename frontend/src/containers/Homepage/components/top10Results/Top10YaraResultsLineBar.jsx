import HorizontalBarChart from "../../../../shared/components/charts/HorizontalBarChart";
import React from "react";
import {useStatsTopResults} from "../../../../queries/Stats";
import {YARA_LABEL} from "../../../../shared/helpers/rules";


const Top10YaraResultsLineBar = () => {
  const {
    data: dataYara,
    isIdle: isIdleYara,
    isLoading: isLoadingYara,
    isError: isErrorYara
  } = useStatsTopResults(YARA_LABEL);

  return (
    <HorizontalBarChart
      title={'Top 10 Yara match'}
      data={dataYara}
      isLoading={isLoadingYara || isIdleYara}
      isError={isErrorYara}
      dataKey={'count'}
      labelDataKey={'name'}
    />
  )
}


export default Top10YaraResultsLineBar;
