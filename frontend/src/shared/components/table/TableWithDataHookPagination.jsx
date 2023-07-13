import React, {useEffect, useState} from 'react';
import ReactTableBase from "../../../shared/components/table/ReactTableBase";
import PropTypes from "prop-types";

const _ = require('lodash')


const tableDefaultConfig = {
  withPagination: true,
  manualPageSize: [10, 25, 50, 100],
}

const TableWithDataHookPagination = ({
  useDataQuery,
  defaultSize = 10,
  defaultPage = 0,
  totalItems,
  queryParams,
  tableColumns,
  tableConfig = tableDefaultConfig,
  getRowDataId = (row, i) => (_.get(row, 'original.eventId', i)),
  onRowClick,
  filters
}) => {
  const [pageSize, setPageSize] = useState(defaultSize);
  const [pageIndex, setPageIndex] = useState(defaultPage);
  const [dataTable, setDataTable] = useState([]);

  const { data, isIdle, isLoading, isError } = useDataQuery(queryParams, pageSize, pageIndex);

  useEffect(() => {
    if (!isIdle && !isLoading && !isError) {
      setDataTable(data)
    } else {
      const itemToLoad = totalItems - pageSize * pageIndex < pageSize ? totalItems - pageSize * pageIndex : pageSize;
      setDataTable(_.range(itemToLoad).map(index => ({isLoading: true})))
    }
  }, [isIdle, isLoading, isError, data])

  if (isError) {
    return <h3>ERROR WHILE LOADING THE DATA</h3>
  }

  tableConfig = Object.assign({}, {
    manualPagination: true,
    pageCount: Math.ceil(totalItems / pageSize)
  }, tableConfig);

  return (
      <ReactTableBase
        key="modified"
        // key={key}
        data={dataTable}
        columns={tableColumns}
        tableConfig={tableConfig}
        getRowDataId={getRowDataId}
        onRowClick={onRowClick}
        filters={filters}
        setPageIndex={setPageIndex}
        setPageSize={setPageSize}
        dataLength={totalItems}
      />
    );
}

TableWithDataHookPagination.propTypes = {
  useDataQuery: PropTypes.func.isRequired,
  queryParams: PropTypes.shape(),
  tableColumns: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  tableConfig: PropTypes.arrayOf(PropTypes.shape()),
  getRowDataId: PropTypes.func,
  onRowClick: PropTypes.func,
  filters:PropTypes.arrayOf(PropTypes.shape()),
  conditionalRowStyles:PropTypes.arrayOf(PropTypes.shape())
};

export default TableWithDataHookPagination;
