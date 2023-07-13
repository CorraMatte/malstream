import React from 'react';
import PropTypes from 'prop-types';
import {Progress} from "reactstrap";

const onRowClickGen = (onRowClick, getRowDataId, row) => {
  return (onRowClick) ? (
    () => ((getRowDataId) ? onRowClick(getRowDataId(row, row.index), row) : onRowClick())
  ) : null;
}

const defaultPropGetter = () => ({})

const ReactTableDefaultBody = ({ page, getTableBodyProps, prepareRow, getRowDataId, onRowClick,
                                 getCellProps = defaultPropGetter,getColumnProps=defaultPropGetter}) => (
  <tbody className="table table--bordered" {...getTableBodyProps()}>
    {page.map((row) => {
      prepareRow(row);
      return (
        <tr {...row.getRowProps()} id={(getRowDataId) ? "row-" + getRowDataId(row, row.index) : "row-" + row.index} data-key={(getRowDataId) ? getRowDataId(row, row.index) : row.index} onClick={onRowClickGen(onRowClick, getRowDataId, row)}>
          {row.cells.map(cell =>
                <td {...cell.getCellProps([
                  {
                    className: cell.column.className,
                    style: cell.column.style,
                  },
                  getColumnProps(cell.column),
                  getCellProps(cell),
                ])}>{
                  cell.row?.original?.isLoading ?
                    <div className={'progress-wrap progress-wrap--small progress-wrap--grey w-25'}><Progress animated value={100} /></div> :
                    cell.render('Cell')
                }
                </td>
          )}
        </tr>
      );
    })}
  </tbody>
);

ReactTableDefaultBody.propTypes = {
  page: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getTableBodyProps: PropTypes.func.isRequired,
  prepareRow: PropTypes.func.isRequired,
};

const ReactTableBody = ({
  page, getTableBodyProps, prepareRow, getRowDataId, onRowClick
}) =>
    <ReactTableDefaultBody
      page={page}
      getTableBodyProps={getTableBodyProps}
      prepareRow={prepareRow}
      getRowDataId={getRowDataId}
      onRowClick={onRowClick}
    />



ReactTableBody.propTypes = {
  page: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  getTableBodyProps: PropTypes.func.isRequired,
  prepareRow: PropTypes.func.isRequired,
  getRowDataId: PropTypes.func,
  onRowClick: PropTypes.func,
};

export default ReactTableBody;