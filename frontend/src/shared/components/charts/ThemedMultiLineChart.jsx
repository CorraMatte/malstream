import PropTypes from "prop-types";
import {Card, CardBody} from "reactstrap";
import LoadingSpinner from "../LoadingSpinner";
import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatDateUTCtoYearMonthDayTime} from "../../helpers/date";
import getTooltipStyles from "../../helpers";


const ThemedMultiLineChart = ({
  title,
  data,
  dataKeys,
  dataName,
  isLoading = false,
  isError = false
}) => {
  const CHARTS_COLORS = [
    '#4ce1b6', '#70bbfd', '#ff4861',
    '#c88ffa', '#40e5e8', '#f6da6e',
    '#c6ff00', '#ff3d00', '#8c9eff',
    '#ff80ab'
  ]

  return (
    <Card>
      <CardBody>
        <div className="card__title">
          <div className="card__title">
            <h4 className="bold-text">{title}</h4>
          </div>
        </div>
        {
          isError ? <p>ERROR WHILE FETCHING DATA!</p> :
            (isLoading) ?
              <LoadingSpinner/> :
              <ResponsiveContainer height={320} className="dashboard__area">
                <LineChart data={data} margin={{top: 20, left: -15, bottom: 20}}>
                  <XAxis dataKey={x => formatDateUTCtoYearMonthDayTime(x.date)} tickLine={false}/>
                  <YAxis tick={true}/>
                  <Tooltip {...getTooltipStyles()} />
                  <Legend/>
                  <CartesianGrid/>
                  {
                    dataKeys.map(
                      (dataKey, index) =>
                        <Line
                          name={dataName}
                          type="monotone"
                          dataKey={dataKey}
                          fill={CHARTS_COLORS[index]}
                          stroke={CHARTS_COLORS[index]}
                          key={index}
                        />
                    )
                  }
                </LineChart>
              </ResponsiveContainer>
        }
      </CardBody>
    </Card>
  )
}

ThemedMultiLineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  dataKeys: PropTypes.array.isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
};


export default ThemedMultiLineChart;