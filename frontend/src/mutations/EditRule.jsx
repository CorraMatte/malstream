import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const EditRuleFetcher = (ruleId, params) => {
  return axios.put(`${apiUrl}/rules/${ruleId}`, params).then(res => res.data);
}

export const useEditRuleMutation = (fetcher = EditRuleFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['edit-rule'],
    ({ruleId, ruleType, params}) => fetcher(ruleId, params),
    {onSuccess: (_, {ruleId, ruleType}) => {
        queryClient.invalidateQueries(['edit-rule']);
        queryClient.invalidateQueries(['all-rules', ruleType, '']);
        queryClient.invalidateQueries(['rule', ruleId, true]);
        queryClient.invalidateQueries(['rule', ruleId, false]);
      }}
  )
}
