import {apiUrl} from "../config/api"
import axios from "axios";
import PropTypes from "prop-types";
import {useQuery} from "react-query";

export const RuleByIDTotalResultsFetcher = (uid) => {
  return axios.get(`${apiUrl}/rules/${uid}/indicators/count`).then(res => res.data);
}


export const useRuleByIDTotalResults = (uid, fetcher = RuleByIDTotalResultsFetcher) => {
  return useQuery(
    ['rule-results-total', uid], () => fetcher(uid)
  )
}

useRuleByIDTotalResults.propTypes = {
  uid: PropTypes.string.isRequired,
};
