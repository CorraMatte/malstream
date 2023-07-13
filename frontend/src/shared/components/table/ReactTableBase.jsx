import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useFlexLayout} from 'react-table';
import ReactTableConstructor from './components/ReactTableConstructor';
import ReactTableCell from './components/ReactTableCell';
import ReactTableCellEditable from './components/ReactTableEditableCell';

const ReactTableBase = ({
  useDataQuery,
  setPageSize,
  setPageIndex,
  queryParams,
  tableConfig,
  columns,
  data,
  updateDraggableData,
  updateEditableData,
  getRowDataId,
  onRowClick,
  filters,
  dataLength = null
}) => {
  const {
    isEditable = false,
    isResizable = false,
    isSortable = false,
    withDragAndDrop = false,
    withPagination = false,
    withSearchEngine = false,
    manualPageSize = [10, 25, 50, 100],
    manualPagination = false,
    pageCount = 0
  } = tableConfig;

  const [filterValue, setFilterValue] = useState(null);

  const tableOptions = {
    columns,
    data,
    updateDraggableData,
    updateEditableData,
    setFilterValue,
    getRowDataId,
    onRowClick,
    defaultColumn: {},
    isEditable,
    withDragAndDrop: withDragAndDrop || false,
    dataLength: data.length,
    autoResetPage: false,
    disableSortBy: !isSortable,
    manualSortBy: !isSortable,
    manualGlobalFilter: !withSearchEngine && !(!withPagination || manualPagination),
    manualPagination: !withPagination || manualPagination,
    initialState: {
      pageIndex: 0,
      pageSize: manualPageSize ? manualPageSize[0] : 10,
      globalFilter: withSearchEngine && filterValue ? filterValue : '',
    },
  };

  if (pageCount > 0) {
    tableOptions.pageCount = pageCount;
  }

  if (dataLength !== null) {
    tableOptions.dataLength = dataLength;
  }

  let tableOptionalHook = [];
  if (isResizable) tableOptionalHook = [useFlexLayout];
  if (withSearchEngine) {
    tableOptions.defaultColumn = {
      Cell: ReactTableCell,
    };
  }
  if (isEditable) {
    tableOptions.defaultColumn = {
      Cell: ReactTableCellEditable,
    };
  }

  return (
    <ReactTableConstructor
      key={isResizable || isEditable ? 'modified' : 'common'}
      tableConfig={tableConfig}
      tableOptions={tableOptions}
      tableOptionalHook={tableOptionalHook}
      getRowDataId={getRowDataId}
      onRowClick={onRowClick}
      filters={filters}
      useDataQuery={useDataQuery}
      queryParams={queryParams}
      setQueryPageSize={setPageSize}
      setQueryPageIndex={setPageIndex}
    />
  );
};

ReactTableBase.propTypes = {
  tableConfig: PropTypes.shape({
    isEditable: PropTypes.bool,
    isResizable: PropTypes.bool,
    isSortable: PropTypes.bool,
    withDragAndDrop: PropTypes.bool,
    withPagination: PropTypes.bool,
    withSearchEngine: PropTypes.bool,
    withHover: PropTypes.bool,
    searchPlaceholder: PropTypes.string,
    manualPageSize: PropTypes.arrayOf(PropTypes.number),
  }),
  columns: PropTypes.arrayOf(PropTypes.shape({
    key: PropTypes.string,
    name: PropTypes.string,
  })),
  data: PropTypes.arrayOf(PropTypes.shape()),
  updateDraggableData: PropTypes.func,
  updateEditableData: PropTypes.func,
  getRowDataId: PropTypes.func,
  onRowClick: PropTypes.func,
  filters:PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  dataLength: PropTypes.number
};

ReactTableBase.defaultProps = {
  tableConfig: {},
  columns: [],
  data: [],
  setFilterName:null,
  setFilterState:null,
};

export default ReactTableBase;
