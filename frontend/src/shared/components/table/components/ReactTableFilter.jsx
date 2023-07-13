import React, {useState} from 'react';
import PropTypes from 'prop-types';
import {useAsyncDebounce} from 'react-table';
import {Input} from 'reactstrap';

const ReactTableFilter = ({
  rows,
  setGlobalFilter, setFilterValue,
  globalFilter, searchPlaceholder, dataLength,
}) => {
  const [value, setValue] = useState(globalFilter);
  const onChange = useAsyncDebounce((item) => {
    setGlobalFilter(item || undefined);
  }, 200);
  setFilterValue(value);

  return (
    <div className="table__search">
      <Input
        className="table__search table__search-input"
        value={value}
        onChange={(e) => {
          setValue(e.target.value);
          onChange(e.target.value);
        }}
        placeholder={`${searchPlaceholder}`}
      />
      {dataLength !== rows.length && (
        <span>Found {rows.length} matches</span>
      )}
    </div>
  );
};

const filterGreaterThan = (rows, id, filterValue) => rows.filter((row) => {
  const rowValue = row.values[id];
  return rowValue >= filterValue;
});

filterGreaterThan.autoRemove = val => typeof val !== 'number';

ReactTableFilter.propTypes = {
  rows: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  setGlobalFilter: PropTypes.func.isRequired,
  setFilterValue: PropTypes.func,
  globalFilter: PropTypes.string,
  searchPlaceholder: PropTypes.string,
  dataLength: PropTypes.number.isRequired,
};

ReactTableFilter.defaultProps = {
  setFilterValue: () => {},
  globalFilter: '',
  searchPlaceholder: 'Search...',
};

export default ReactTableFilter;
