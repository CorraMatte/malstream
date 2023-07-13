import InfiniteScroll from "react-infinite-scroller";
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import IndicatorResumeResultsCard from "../../Indicator/components/IndicatorResumeResultsCard";
import React, {useEffect, useState} from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import {get_title_from_rule} from "../../../shared/helpers/rules";
import {useRuleByIDResults} from "../../../queries/RuleByIDIndicatorsResults";
import ErrorHandler from "../../../shared/components/ErrorHandler";
import {Col, Row} from "reactstrap";
import {useRuleByIDTotalResults} from "../../../queries/RuleByIDIndicatorsTotal";


const RuleResults = ({ruleId}) => {
  const LOADING_STEP = 20;
  const [loadedItems, setLoadedItems] = useState(LOADING_STEP);
  const [displayResultsArray, setDisplayResultsArray] = useState([]);

  const {
    data: dataTotal,
    isIdle: isIdleTotal,
    isLoading: isLoadingTotal,
    isError: isErrorTotal,
    isFetching: isFetchingTotal,
    error: errorTotal,
  } = useRuleByIDTotalResults(ruleId);

  const {data, isIdle, isLoading, isError, error, isFetching} = useRuleByIDResults(
    ruleId, loadedItems - LOADING_STEP, LOADING_STEP, !_.isUndefined(dataTotal?.total)
  );


  useEffect(() => {
    if (!isIdle && !isLoading && !isError && !isFetching) {
      _.forEach(data, (result) => {
        _.forEach(result[data.type], (rule) => {
          if (_.toLower(get_title_from_rule(data.type, rule)) === _.toLower(data.title)) {
            rule.exists_in_platform = true;
          }
        })
      })

      setDisplayResultsArray(displayResultsArray.concat(data));
    }
  }, [isIdle, isLoading, isError, isFetching, data])

  if ((isLoading || isIdle || isFetching) && displayResultsArray.length === 0) {
    return <LoadingSpinner/>
  }

  if (isError || isErrorTotal) {
    return <ErrorHandler error={error || errorTotal}/>
  }

  const loadMoreItems = () => {
    if (!isIdle && !isLoading) {
      setLoadedItems(loadedItems + LOADING_STEP);
    }
  }

  return (
    isIdleTotal || isLoadingTotal || isFetchingTotal ||
    ((isLoading || isLoading || isFetching) && displayResultsArray.length === 0) ?
      <LoadingSpinner/> :
      <Row className={'mt-4'}>
        <Col className={'mx-auto mb-2'}>
          {
            displayResultsArray.length > 0 &&
            <InfiniteScroll
              loadMore={loadMoreItems}
              hasMore={loadedItems < dataTotal.total}
              loader={<LoadingSpinner/>}
              threshold={800}
            >
              {
                displayResultsArray.map((i, index) => (
                  <IndicatorResumeResultsCard indicator={displayResultsArray[index]} key={index}/>
                ))
              }
            </InfiniteScroll>
          }
        </Col>
      </Row>
  )
}

RuleResults.propTypes = {
  ruleId: PropTypes.string.isRequired
}

export default RuleResults;
