import React, {useMemo, useState} from 'react';
import {Card, CardBody} from 'reactstrap';
import {Legend, Pie, PieChart, ResponsiveContainer, Tooltip} from 'recharts';
import getTooltipStyles from '../../../shared/helpers';
import LoadingSpinner from "../LoadingSpinner";
import PropTypes from "prop-types";
import classNames from "classnames";


const renderLegend = ({ payload, onClick }) => {
  return (
    <ul className={"dashboard__chart-legend"}>
      {payload.map((entry, index) => (
        <li key={`item-${index}`}
            onClick={() => {
              if (onClick) {
                onClick(entry.value)
              }
            }}
        >
          <span style={{ backgroundColor: entry.color }} />{entry.value}
        </li>
      ))}
    </ul>
  );
}

const PieChartMultipleItems = ({
  title,
  data,
  subtitle = "",
  isLoading = false,
  isError = false,
  dataKey,
  classNamePie = 'dashboard__chart-pie--commerce',
}) => {
  const [coordinates, setCoordinates] = useState({ x: 0, y: 0 });

  const onMouseMove = (e) => {
    setCoordinates({ x: e.tooltipPosition.x, y: e.tooltipPosition.y });
  };

  const classes = classNames({
      [classNamePie]: true,
    'dashboard__chart-pie': true
  });

  const PIE_COLORS = [
    '#4ce1b6', '#70bbfd', '#ff4861',
    '#c88ffa', '#40e5e8', '#f6da6e',
    '#c6ff00', '#ff3d00', '#8c9eff',
    '#ff80ab'
  ]

  data = useMemo(() =>
    (!isLoading && !isError) ?
      data.map((val, index) => ({
        name: val.name,
        [dataKey]: val[dataKey],
        fill: PIE_COLORS[index],
      })) : [], [isLoading, isError, data, dataKey, PIE_COLORS]
  );

  return (
    <Card className={'h-auto'}>
      <CardBody>
        <div className="card__title">
          <h4 className="bold-text">{title}</h4>
          <h4 className="subhead">{subtitle ? subtitle : ""}</h4>
        </div>
        {
          isError ? <p>ERROR WHILE FETCHING DATA!</p> :
            isLoading ? <LoadingSpinner /> :
            <ResponsiveContainer className={classes} height={360}>
              <PieChart className="dashboard__chart-pie-container">
                <Tooltip
                  position={coordinates}
                  {...getTooltipStyles()}
                  formatter={(value, name, props) => [value, name.toUpperCase(),]}
                />
                <Pie
                  data={data}
                  dataKey={dataKey}
                  cy={180}
                  innerRadius={100}
                  outerRadius={130}
                  label
                  isAnimationActive={false}
                  onMouseMove={onMouseMove}
                />
                <Legend layout="vertical" verticalAlign="bottom" wrapperStyle={{
                  left: 0,
                  width: 200,
                  lineHeight: '24px',
                  position: 'absolute',
                  wordBreak: 'break-all'
                }} content={renderLegend} />
              </PieChart>
            </ResponsiveContainer>
        }
      </CardBody>
    </Card>
  );
};

PieChartMultipleItems.propTypes = {
  title: PropTypes.string.isRequired,
  data: PropTypes.array.isRequired,
  subtitle: PropTypes.string,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool
};


export default PieChartMultipleItems;
