import PropTypes from "prop-types";
import {Card, CardBody} from "reactstrap";
import LoadingSpinner from "../LoadingSpinner";
import React from "react";
import {CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import {formatDateUTCtoYearMonthDayTime} from "../../helpers/date";
import getTooltipStyles from "../../helpers";


const ThemedLineChart = ({
  title,
  data,
  dataKey,
  dataName = dataKey,
  isLoading = false,
  isError = false,
}) => {
  return (
    <Card className={'h-auto'}>
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
              <ResponsiveContainer height={335} className="dashboard__area">
                <LineChart data={data} margin={{top: 20, left: -15, bottom: 20}}>
                  <XAxis dataKey={x => formatDateUTCtoYearMonthDayTime(x.date)} tickLine={false}/>
                  <YAxis tick={true}/>
                  <Tooltip {...getTooltipStyles()} />
                  <Legend/>
                  <CartesianGrid/>
                  <Line
                    type="monotone"
                    dataKey={dataKey}
                    name={dataName}
                    fill="#4ce1b6"
                  />
                </LineChart>
              </ResponsiveContainer>
        }
      </CardBody>
    </Card>
  )
}

ThemedLineChart.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.string.isRequired,
  dataName: PropTypes.string,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
};

export default ThemedLineChart;