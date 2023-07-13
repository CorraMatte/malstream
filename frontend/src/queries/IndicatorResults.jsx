import {apiUrl} from "../config/api"
import axios from "axios";
import PropTypes from "prop-types";
import {useQuery} from "react-query";
import {ALL_RESULTS_SECTION} from "../containers/Indicator/components/IndicatorResults";


export const useIndicatorResultsFetcher = (offset, limit, result_status) => {
  const urlParams = new URLSearchParams();

  urlParams.set('limit', limit);
  urlParams.set('offset', offset);
  urlParams.set('result_status', result_status);

  return axios.get(`${apiUrl}/indicators?${urlParams.toString()}`).then(res => res.data);
}


export const useIndicatorResults = (
  offset = 0, limit = 20, enabled = true, result_status = ALL_RESULTS_SECTION,
  fetcher = useIndicatorResultsFetcher
) => {
  return useQuery(
    ['indicator', offset, limit, result_status], () => fetcher(offset, limit, result_status),
    {enabled: enabled, refetchOnWindowFocus: false}
  )
}

useIndicatorResults.propTypes = {
  offset: PropTypes.number.isRequired,
  limit: PropTypes.number.isRequired,
};
