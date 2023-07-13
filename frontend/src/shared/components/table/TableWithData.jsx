import React from 'react';
import LoadingSpinner from "../LoadingSpinner";
import ReactTableBase from "../../../shared/components/table/ReactTableBase";
import PropTypes from "prop-types";

const _ = require('lodash')


const tableDefaultConfig = {
  withPagination: true,
  // isResizable: true,
  manualPageSize: [10, 25, 50, 100],
}

const TableWithData = ({
  data,
  isLoading,
  isError,
  tableColumns,
  tableConfig = tableDefaultConfig,
  getRowDataId = (row, i) => (_.get(row, 'original.eventId', i)),
  onRowClick,
  filters
}) => {

  if (isLoading) {
    return (
      <LoadingSpinner />
    );
  } else if (isError) {
    return (
      <p>ERROR WHILE FETCHING DATA!</p>
    );
  } else {
    return (
      <ReactTableBase
        key="modified"
        columns={tableColumns}
        data={data}
        tableConfig={tableConfig}
        getRowDataId={getRowDataId}
        onRowClick={onRowClick}
        filters={filters}
      />
    );
  }
}

TableWithData.propTypes = {
  data: PropTypes.shape().isRequired,
  isLoading: PropTypes.bool,
  isError: PropTypes.bool,
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableConfig: PropTypes.arrayOf(PropTypes.shape()),
  getRowDataId: PropTypes.func,
  onRowClick: PropTypes.func,
  filters:PropTypes.arrayOf(PropTypes.shape()),
  conditionalRowStyles:PropTypes.arrayOf(PropTypes.shape())
};

export default TableWithData;
