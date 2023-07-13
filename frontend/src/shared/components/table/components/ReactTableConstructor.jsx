import React, {useEffect} from 'react';
import PropTypes from 'prop-types';
import {
  useFilters,
  useGlobalFilter,
  usePagination,
  useResizeColumns,
  useRowSelect,
  useSortBy,
  useTable,
} from 'react-table';
import {Table} from "reactstrap"
import ReactTableHeader from './ReactTableHeader';
import BodyReactTable from './ReactTableBody';
import ReactTableFooter from './ReactTableFooter';
import ReactTableFilter from './ReactTableFilter';
import ReactTablePagination from './ReactTablePagination';
import {usePrevious} from "../../../helpers/customhooks";


const ReactTableConstructor = ({
  tableConfig, // config for calling component and for this component
  tableOptions, // options for react-table's useTable hook - generated at higher level based on config
  tableOptionalHook,
  getRowDataId,
  onRowClick,
  setQueryPageSize = null,
  setQueryPageIndex = null,
  filters
}) => {
  const {
    isEditable,
    isResizable,
    isSortable,
    withPagination,
    withSearchEngine,
    withHover,
    manualPageSize,
    searchPlaceholder,
    striped
  } = tableConfig;

  const {
    getTableProps,
    getTableBodyProps,
    getCellProps,
    headerGroups,
    footerGroups,
    state,
    rows,
    prepareRow,
    page,
    pageCount,
    pageOptions,
    gotoPage,
    previousPage,
    canPreviousPage,
    nextPage,
    canNextPage,
    setPageSize,
    setGlobalFilter,
    withDragAndDrop,
    updateDraggableData,
    updateEditableData,
    dataLength,
    setFilter,
    state: {pageIndex, pageSize},
  } = useTable(
    tableOptions,
    useGlobalFilter,
    useFilters,
    useSortBy,
    usePagination,
    useResizeColumns,
    useRowSelect,

    ...tableOptionalHook,
  );

  window.tablePage = page;
  const previousFilterStates = usePrevious(filters.map((x => ({key: x.accessorName, value: x.filterState}))))

  useEffect(() => {
    if (setQueryPageIndex && setQueryPageSize) {
      setQueryPageSize(pageSize);
      setQueryPageIndex(pageIndex);
    }
  }, [pageIndex, pageSize])

  useEffect(() => {
    if (previousFilterStates !== undefined) {
      filters.forEach(function (filter) {
        if (filter.filterState !== previousFilterStates[filter.accessorName]) {
          setFilter(filter.accessorName, filter.filterState)
        }
      })
    }
  }, filters.map(x => x.filterState))

  return (
    <div>
      {withSearchEngine && (
        <ReactTableFilter
          rows={rows}
          setGlobalFilter={setGlobalFilter}
          setFilterValue={tableOptions.setFilterValue}
          globalFilter={state.globalFilter}
          searchPlaceholder={searchPlaceholder}
          dataLength={dataLength}
        />
      )}
      <div className={withPagination ? 'table react-table' : 'table react-table table--not-pagination'}>
        <Table
          {...getTableProps()}
          hover={withHover}
          striped={striped}
          className={isEditable ? 'react-table editable-table' : 'react-table resizable-table'}
        >
          <ReactTableHeader
            headerGroups={headerGroups}
            isSortable={isSortable}
            isResizable={isResizable}
          />
          <BodyReactTable
            page={page}
            getTableBodyProps={getTableBodyProps}
            getCellProps={getCellProps}
            prepareRow={prepareRow}
            updateDraggableData={updateDraggableData}
            updateEditableData={updateEditableData}
            isEditable={isEditable}
            withDragAndDrop={withDragAndDrop}
            getRowDataId={getRowDataId}
            onRowClick={onRowClick}
          />
          {(pageCount === (pageIndex + 1) || (!withPagination && rows.length !== 0)) && (
            <ReactTableFooter
              footerGroups={footerGroups}
            />
          )}
        </Table>
      </div>
      {(withPagination && rows.length > 0) && (
        <ReactTablePagination
          page={page}
          gotoPage={gotoPage}
          previousPage={previousPage}
          nextPage={nextPage}
          canPreviousPage={canPreviousPage}
          canNextPage={canNextPage}
          pageOptions={pageOptions}
          pageSize={pageSize}
          pageIndex={pageIndex}
          pageCount={pageCount}
          setPageSize={setPageSize}
          manualPageSize={manualPageSize}
          dataLength={dataLength}
        />
      )}
    </div>
  );
};

ReactTableConstructor.propTypes = {
  tableConfig: PropTypes.shape({
    isEditable: PropTypes.bool,
    isResizable: PropTypes.bool,
    isSortable: PropTypes.bool,
    withDragAndDrop: PropTypes.bool,
    withPagination: PropTypes.bool,
    withSearchEngine: PropTypes.bool,
    manualPageSize: PropTypes.arrayOf(PropTypes.number),
    searchPlaceholder: PropTypes.string,
  }).isRequired,
  tableOptions: PropTypes.shape({
    columns: PropTypes.arrayOf(PropTypes.shape({
      key: PropTypes.string,
      name: PropTypes.string,
    })),
    data: PropTypes.arrayOf(PropTypes.shape()),
    setFilterValue: PropTypes.func,
    updateData: PropTypes.func,
    defaultColumn: PropTypes.oneOfType([
      PropTypes.any,
      PropTypes.shape({
        Cell: PropTypes.func,
      }).isRequired,
    ]),
    isEditable: PropTypes.bool,
    withDragAndDrop: PropTypes.bool,
    dataLength: PropTypes.number,
    initialState: {
      pageIndex: PropTypes.number,
      pageSize: PropTypes.number,
    },
  }),
  getRowDataId: PropTypes.func,
  onRowClick: PropTypes.func,
  filters: PropTypes.arrayOf(PropTypes.shape().isRequired).isRequired,
  tableOptionalHook: PropTypes.shape().isRequired,
};

ReactTableConstructor.defaultProps = {
  tableOptions: [{
    columns: [],
    data: [],
    isEditable: PropTypes.bool,
    setFilterValue: () => {
    },
    updateData: () => {
    },
    defaultColumn: [],
    withDragAndDrop: false,
    dataLength: null,
    autoResetPage: false,
    disableSortBy: false,
    manualSortBy: false,
    manualGlobalFilter: false,
    manualPagination: false,
    initialState: {
      pageIndex: null,
      pageSize: null,
    },
  }],
  filters: []
};

export default ReactTableConstructor;
