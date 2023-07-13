import {apiUrl} from "../config/api"
import axios from "axios";
import PropTypes from "prop-types";
import {useQuery} from "react-query";


const _ = require('lodash')


export const RuleByIDResultsFetcher = (
  uid, offset = null, limit = null
) => {
  const urlParams = new URLSearchParams();

  if (!_.isNull(offset)) {
    urlParams.set('offset', offset);
  }

  if (!_.isNull(limit)) {
    urlParams.set('limit', limit);
  }

  return axios.get(`${apiUrl}/rules/${uid}/indicators?${urlParams.toString()}`).then(res => res.data);
}


export const useRuleByIDResults = (
  uid, offset = null, limit = null, enabled = true,
  fetcher = RuleByIDResultsFetcher
) => {
  return useQuery(
    ['rule-results', uid, offset, limit], () => fetcher(uid, offset, limit), {enabled: enabled}
  )
}

useRuleByIDResults.propTypes = {
  uid: PropTypes.string.isRequired,
  q: PropTypes.string
};
