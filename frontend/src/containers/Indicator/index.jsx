import {Col, Container, Row} from "reactstrap";
import React, {Fragment, useEffect, useState} from "react";
import SearchBarOnEnter from "../../shared/components/form/SearchBarOnEnter";
import paths from "../../config/paths";
import {useHistory} from "react-router-dom";
import {isValidSha256} from "../../shared/helpers";
import IndicatorDetail from "./components/IndicatorDetail";
import _ from "lodash";
import {paramsToObject, useQueryParams} from "../../shared/components/router/QueryNavigationHelpers";
import IndicatorResults from "./components/IndicatorResults";


const Indicator = () => {
  const params = paramsToObject(useQueryParams().entries());
  const value = params?.value || '';
  const history = useHistory();
  const [searchTerm, setSearchTerm] = useState(value);
  const [isEmptySearch, setIsEmptySearch] = useState(_.isUndefined(searchTerm) || searchTerm === '');
  const showResults = isEmptySearch || !isValidSha256(_.toLower(searchTerm));

  useEffect(() => {
    setSearchTerm(value);
    setIsEmptySearch(value === '');
  }, [value])

  return (
    <Fragment>
      <Container>
        <Row className={'mb-3'}>
          <Col md={12}>
            <SearchBarOnEnter
              searchPlaceholder={'Type an hash and press enter'}
              setSearch={(val) => history.replace(`${paths.resultPath}?value=${val}`)}
              searchTerm={searchTerm}
              errorMessage={'Insert a valid sha256'}
              errorFn={(searchTerm) => !_.isUndefined(searchTerm) && !isValidSha256(_.toLower(searchTerm)) && searchTerm.length !== 0}
              withSearchButton
            />
          </Col>
        </Row>
        {
          showResults ? <IndicatorResults /> : <IndicatorDetail searchTerm={searchTerm} />
        }
      </Container>
    </Fragment>
  )
}


Indicator.propTypes = {
}

export default Indicator;
