import ThemedMultiLineChart from "../../../shared/components/charts/ThemedMultiLineChart";
import React, {useMemo} from "react";
import {useStatsTrendOsint} from "../../../queries/Stats";
import _ from "lodash";


const OsintTopResultsTrend = () => {
  const {data, isIdle, isLoading, isError} = useStatsTrendOsint();

  const dataKeys = useMemo(
    () => (isLoading || isIdle || isError) ? [] : data.map((res) => res.name),
    [isLoading, isError, isIdle, data]
  )

  const trends = useMemo(
    () => (isLoading || isIdle || isError) ? [] : data,
    [isLoading, isError, isIdle, data]
  )

  const unique_dates = new Set();

  _.forEach(trends, (entry) => {
    _.forEach(entry.trend, (trend) => unique_dates.add(trend.date))
  })

  const chart_data = []

  _.forEach(_.toArray(unique_dates), (date) => {
    const item = {};

    _.forEach(dataKeys, (dataKey) => {
      const dataElem = _.filter(data, (v) => v.name === dataKey)[0];
      const count = _.filter(dataElem.trend, (t) => t.date === date)[0];

      if (!count) {
        item[dataKey] = 0;
      } else {
        item[dataKey] = count.count;
      }
    });

    item.date = date;

    chart_data.push(item)
  })


  return (
    <ThemedMultiLineChart
      dataKeys={dataKeys}
      data={chart_data}
      title={'Last day top 5 osint matches'}
      isError={isError}
      isLoading={isLoading || isIdle}
    />
  )
}

export default OsintTopResultsTrend;
