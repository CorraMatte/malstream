import {useQueries} from "react-query";
import axios from "axios";
import {apiUrl} from "../config/api";


export const AllResultsFetcher = (rule_type) => {
  const urlParams = new URLSearchParams();

  if (rule_type) {
    urlParams.set('rule_type', rule_type);
  }

  return axios.get(`${apiUrl}/rules/count?${urlParams.toString()}`).then(res => res.data);
}

export const useAllResultsQuery = (rule_types, fetcher = AllResultsFetcher) => {
  return useQueries(
    rule_types.map((rule_type) => ({
      rule_type: rule_type,
      queryKey: ['rule-count', rule_type],
      queryFn: (accessToken) => fetcher(accessToken, rule_type)
    })).map((q) => Object.assign({}, {queryKey: q.queryKey, queryFn: () => q.queryFn(q.rule_type)}))
  )
}
