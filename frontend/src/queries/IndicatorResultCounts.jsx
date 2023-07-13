import {IndicatorTotalResultsFetcher} from "./IndicatorTotalResults";
import {useQueries} from "react-query";
import PropTypes from "prop-types";


export const useIndicatorResultCountsQuery = (results_status, fetcher = IndicatorTotalResultsFetcher) => {
  return useQueries(
    results_status.map((result_status) => ({
      result_status: result_status,
      queryKey: ['indicator-count', result_status],
      queryFn: (accessToken) => fetcher(accessToken, result_status)
    })).map((q) => Object.assign({}, {
      queryKey: q.queryKey,
      queryFn: () => q.queryFn(q.result_status),
      refetchOnWindowFocus: false
    }))
  )
}


useIndicatorResultCountsQuery.propTypes = {
  result_status: PropTypes.arrayOf(PropTypes.string).isRequired
};
