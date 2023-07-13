import {apiUrl} from "../config/api"
import axios from "axios";
import PropTypes from "prop-types";
import {useQuery} from "react-query";


export const RuleByIdFetcher = (uid)=> {
  return axios.get(`${apiUrl}/rules/${uid}`).then(res => res.data);
}


export const useRuleByIdQuery = (uid, enabled = true, fetcher = RuleByIdFetcher) => {
  return useQuery(
    ['rule', uid], () => fetcher(uid), {enabled: enabled}
  )
}

useRuleByIdQuery.propTypes = {
  uid: PropTypes.string.isRequired,
  q: PropTypes.string
};
