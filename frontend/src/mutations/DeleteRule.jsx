import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const DeleteRuleFetcher = (ruleId) => {
  return axios.delete(`${apiUrl}/rules/${ruleId}`).then(res => res.data);
}

export const useDeleteRuleMutation = (fetcher = DeleteRuleFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['delete-rule'],
    ({ruleId, ruleType}) => fetcher(ruleId, ruleType),
    {onSuccess: (_, {ruleType}) => {
        queryClient.invalidateQueries(['delete-rule']);
      }}
  )
}
