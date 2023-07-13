import {apiUrl} from "../config/api"
import axios from "axios";
import PropTypes from "prop-types";
import {useQuery} from "react-query";
import {isValidSha256} from "../shared/helpers";


export const IndicatorBySha256Fetcher = (sha256) => {
  return axios.get(`${apiUrl}/indicators/${sha256}`).then(res => res.data);
}


export const useIndicatorBySha256Query = (sha256, fetcher = IndicatorBySha256Fetcher) => {
  return useQuery(
    ['indicator', sha256], () => fetcher(sha256),
    {refetchInterval: 10000, enabled: sha256 !== undefined && isValidSha256(sha256)}
  )
}

useIndicatorBySha256Query.propTypes = {
  sha256: PropTypes.string.isRequired,
};
