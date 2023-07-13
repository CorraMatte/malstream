import {Pie, PieChart, ResponsiveContainer} from "recharts";
import React from "react";
import PropTypes from "prop-types";


const GenericCardPieChart = ({dataPie, dataCount, dataName, icon}) =>
  <div className="dashboard__small-pie-chart">
    <ResponsiveContainer height={180}>
      <PieChart>
        <Pie data={dataPie} dataKey="value" cy={85} innerRadius={80} outerRadius={90}/>
      </PieChart>
    </ResponsiveContainer>
    <div className="dashboard__small-pie-chart-info">
      {icon}
      <p className="dashboard__small-pie-chart-number">{dataCount}</p>
      <p className="dashboard__small-pie-chart-units">{dataName}</p>
    </div>
  </div>


GenericCardPieChart.propTypes = {
  dataPie: PropTypes.array.isRequired,
  dataCount: PropTypes.number.isRequired,
  dataName: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired
}

export default GenericCardPieChart;
