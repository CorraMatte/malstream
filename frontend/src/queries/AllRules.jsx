import {apiUrl} from "../config/api"
import axios from "axios";
import PropTypes from "prop-types";
import {useQuery} from "react-query";


export const AllRulesFetcher = (q, ruleType) => {
  const urlParams = new URLSearchParams();

  if (q) {
    urlParams.set('q', q);
  }

  if (ruleType) {
    urlParams.set('rule_type', ruleType);
  }

  return axios.get(`${apiUrl}/rules?${urlParams.toString()}`).then(res => res.data);
}


export const useAllRulesQuery = (q, ruleType, fetcher = AllRulesFetcher) => {
  return useQuery(['all-rules', ruleType, q], () => fetcher(q, ruleType), {cacheTime: 0})
}


useAllRulesQuery.propTypes = {
  q: PropTypes.string.isRequired,
  ruleType: PropTypes.string,
};
