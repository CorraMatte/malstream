import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const AddRuleFetcher = (params, ruleType) => {
  return axios.post(`${apiUrl}/rules/types/${ruleType}`, params).then(res => res.data);
}

export const useAddRuleMutation = (fetcher = AddRuleFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['add-rule'],
    ({params, ruleType}) => fetcher(params, ruleType),
    {onSuccess: (_, {ruleType}) => {
        queryClient.invalidateQueries(['add-rule']);
        queryClient.invalidateQueries(['all-rules', ruleType, '']);
      }}
  )
}
