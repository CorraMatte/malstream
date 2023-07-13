import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const SyncRuleTypesFetcher = (ruleType) => {
  return axios.post(`${apiUrl}/rules/types/${ruleType}/sync`, {}).then(res => res.data);
}

export const useSyncRuleTypesMutation = (fetcher = SyncRuleTypesFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['sync-rule'],
    (ruleType) => fetcher(ruleType),
    {onSuccess: (_, {ruleId, ruleType}) => {
        queryClient.invalidateQueries(['sync-rules']);
      }}
  )
}
