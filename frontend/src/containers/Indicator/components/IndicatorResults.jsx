import React, {useEffect, useState} from 'react';
import LoadingSpinner from "../../../shared/components/LoadingSpinner";
import {Button, Col, Row} from "reactstrap";
import InfiniteScroll from "react-infinite-scroller";
import ErrorHandler from "../../../shared/components/ErrorHandler";
import {useIndicatorResults} from "../../../queries/IndicatorResults";
import IndicatorResumeResultsCard from "./IndicatorResumeResultsCard";
import {useIndicatorTotalResults} from "../../../queries/IndicatorTotalResults";
import _ from "lodash";
import {useQueryClient} from "react-query";
import UploadFileModal from "./UploadFileModal";
import {useIndicatorResultCountsQuery} from "../../../queries/IndicatorResultCounts";
import DeletePendingResultModal from "./DeletePendingResultModal";


export const ALL_RESULTS_SECTION = 'all';
export const PENDING_RESULTS_SECTION = 'pending';
export const FINISHED_RESULTS_SECTION = 'finished';


const IndicatorResults = () => {
  const [overview, setOverview] = useState(ALL_RESULTS_SECTION);
  const RESULTS_STATUS = [
    ALL_RESULTS_SECTION, FINISHED_RESULTS_SECTION, PENDING_RESULTS_SECTION
  ]
  const queries = useIndicatorResultCountsQuery(RESULTS_STATUS);
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
  } = useIndicatorTotalResults(overview);
  const queryClient = useQueryClient();

  const {data, isIdle, isLoading, isError, error, isFetching} = useIndicatorResults(
    loadedItems - LOADING_STEP, LOADING_STEP, !_.isUndefined(dataTotal?.total), overview
  );

  useEffect(() => {
    if (!isIdle && !isLoading && !isError && !isFetching) {
      setDisplayResultsArray(displayResultsArray.concat(data));
    }
  }, [isIdle, isLoading, isError, isFetching, data])

  if (isError || isErrorTotal) {
    return <ErrorHandler error={error || errorTotal}/>
  }

  const loadMoreItems = () => {
    if (!isIdle && !isLoading) {
      setLoadedItems(loadedItems + LOADING_STEP);
    }
  }

  const changeSection = (section) => {
    const old_overview = overview;
    setOverview(section);
    queryClient.refetchQueries(['indicator', 0, 20, old_overview]);
    queryClient.refetchQueries(['indicator-count', old_overview]);
    setDisplayResultsArray([]);
  }

  return (
    <>
      <Row>
        <Col md={12}>
          <UploadFileModal/>
          <Button
            outline
            className={'float-right search_bar-button'}
            onClick={
              () => {
                queryClient.refetchQueries(['indicator', 0, 20, overview]);
                RESULTS_STATUS.map((result_status) =>
                  queryClient.refetchQueries(['indicator-count', result_status])
                );
                setDisplayResultsArray([]);
              }}
          >
            <span>
              Refresh results
            </span>
          </Button>
        </Col>
      </Row>
      <Row>
        <Col md={3}>
          <Button
            active={overview === ALL_RESULTS_SECTION}
            onClick={() => changeSection(ALL_RESULTS_SECTION)}
            outline className={'result_menu-button'}
          >
            ALL {!_.isUndefined(queries[0].data?.total) ? `(${queries[0].data.total})` : ''}
          </Button>
        </Col>

        <Col md={3}>
          <Button
            active={overview === FINISHED_RESULTS_SECTION}
            onClick={() => changeSection(FINISHED_RESULTS_SECTION)}
            outline className={'result_menu-button'}
          >
            FINISHED {!_.isUndefined(queries[1].data?.total) ? `(${queries[1].data.total})` : ''}
          </Button>
        </Col>

        <Col md={3}>
          <Button
            active={overview === PENDING_RESULTS_SECTION}
            onClick={() => changeSection(PENDING_RESULTS_SECTION)}
            outline className={'result_menu-button'}
          >
            PENDING {!_.isUndefined(queries[2].data?.total) ? `(${queries[2].data.total})` : ''}
          </Button>
        </Col>

        <Col md={3}>
          <DeletePendingResultModal/>
        </Col>

      </Row>

      {
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
      }
    </>
  )
}


IndicatorResults.propTypes = {}


export default IndicatorResults;
