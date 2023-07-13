import React from 'react'
import PropTypes from "prop-types";
import getTooltipStyles from "../../helpers";
import {Bar, BarChart, CartesianGrid, Cell, ResponsiveContainer, Tooltip, XAxis, YAxis} from "recharts";
import LoadingSpinner from "../LoadingSpinner";
import {Card, CardBody} from "reactstrap";


const HorizontalBarChart = ({
  data,
  dataKey,
  labelDataKey,
  title,
  subtitle = "",
  isLoading = false,
  isError = false,
  barColors = ["#40e5e8"]
}) => {

  return (
    <Card className={'h-auto'}>
      <CardBody>
        <div className="card__title">
          <h4 className="bold-text">{title}</h4>
          <h4 className="subhead">{subtitle ? subtitle : ""}</h4>
        </div>
        {
          isError ? <p>ERROR WHILE FETCHING DATA!</p> :
          isLoading ? <LoadingSpinner/> :
            <ResponsiveContainer height={400}>
              <BarChart
                margin={{ left: 70, right: 50 }}
                data={data}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis
                  type="number"
                  width={150}
                />
                <YAxis
                  type="category"
                  dataKey={labelDataKey}
                  tickLine={false}
                  verticalAnchor="start"
                />
                <Tooltip
                  {...getTooltipStyles()}
                  formatter={(value, name, props) => [value, 'Hits', ] }
                />
                  <Bar
                    dataKey={dataKey}
                    barSize={20}
                  >
                    {data.map((entry, index) =>
                      <Cell cursor={'pointer'} key={`cell-${index}`} fill={barColors[index % barColors.length]} />)
                    }
                  </Bar>
              </BarChart>
            </ResponsiveContainer>
        }
      </CardBody>
    </Card>

  )
}


HorizontalBarChart.propTypes = {
  data: PropTypes.array.isRequired,
  dataKey: PropTypes.array.isRequired,
  labelDataKey: PropTypes.array.isRequired,
  title: PropTypes.string,
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
}


export default HorizontalBarChart;