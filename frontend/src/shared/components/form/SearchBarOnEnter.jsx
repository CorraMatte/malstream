import {Button, Input} from "reactstrap";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";


const SearchBarOnEnter = ({
  searchTerm,
  searchPlaceholder,
  setSearch,
  withSearchButton = false,
  errorFn = (s) => false,
  errorMessage = ''
}) => {
  const [tmpSearchTerm, setTmpSearchTerm] = useState(searchTerm);

  useEffect(() => {
    setTmpSearchTerm(searchTerm);
  }, [searchTerm])

  return (
    <div>
      {
        withSearchButton &&
        <Button outline onClick={() => setSearch(tmpSearchTerm)} color={'success'} className={'float-right search_bar-button'}>Search</Button>
      }
      <Input
        type={'text'}
        name={'search'}
        id={'search'}
        value={tmpSearchTerm}
        style={withSearchButton ? {width: '80%', display: "inline"} : {}}
        placeholder={searchPlaceholder}
        className={'search_bar'}
        onKeyDown={(e) => {
          if (e.key === 'Enter') {
            setSearch(tmpSearchTerm);
          }
        }}
        onChange={(e) => {
          e.preventDefault();
          setTmpSearchTerm(e.target.value);
        }}
      />
      {errorFn(tmpSearchTerm) && errorMessage && <span className="form__form-group-error-searchbar">{errorMessage}</span>}
    </div>
  )
}

SearchBarOnEnter.propTypes = {
  searchTerm: PropTypes.string.isRequired,
  searchPlaceholder: PropTypes.string.isRequired,
  setSearch: PropTypes.func.isRequired,
  withSearchButton: PropTypes.bool,
  errorFn: PropTypes.func,
  errorMessage: PropTypes.string
}


export default SearchBarOnEnter;
