import {apiUrl} from "../config/api"
import axios from "axios";
import {useQuery} from "react-query";
import PropTypes from "prop-types";


export const IndicatorTotalResultsFetcher = (result_status) => {
  const urlParams = new URLSearchParams();

  urlParams.set('result_status', result_status);

  return axios.get(`${apiUrl}/indicators/count?${urlParams.toString()}`).then(res => res.data);
}


export const useIndicatorTotalResults = (result_status, fetcher = IndicatorTotalResultsFetcher) => {
  return useQuery(
    ['indicator-count', result_status], () => fetcher(result_status),
    {refetchOnWindowFocus: false}
  )
}

useIndicatorTotalResults.propTypes = {
  result_status: PropTypes.string.isRequired
};
