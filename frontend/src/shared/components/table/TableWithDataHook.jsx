import React from 'react';
import PropTypes from "prop-types";
import TableWithData from "./TableWithData";

const defaultDataAccessor = (data) => data;

const tableDefaultConfig = {
  withPagination: true,
  // isResizable: true,
  manualPageSize: [10, 25, 50, 100],
}

const TableWithDataHook = ({
  useDataQuery,
  queryParam = '',
  tableColumns,
  tableConfig = tableDefaultConfig,
  getRowDataId,
  onRowClick,
  dataAccessor = defaultDataAccessor,
  filters
}) => {
  const { data, isIdle, isLoading, isError } = useDataQuery(queryParam);

  return <TableWithData
    data={(!isIdle && !isLoading && data) ? dataAccessor(data) : null}
    isLoading={(isIdle || isLoading)}
    isError={isError}
    tableColumns={tableColumns}
    tableConfig={tableConfig}
    getRowDataId={getRowDataId}
    onRowClick={onRowClick}
    filters={filters}
  />
}

TableWithDataHook.propTypes = {
  useDataQuery: PropTypes.func.isRequired,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableConfig: PropTypes.shape().isRequired,
  getRowDataId: PropTypes.func,
  onRowClick: PropTypes.func,
  filters:PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired
};

export default TableWithDataHook;
