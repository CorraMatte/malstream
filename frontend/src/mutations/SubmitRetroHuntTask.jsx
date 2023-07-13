import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {YARA_LABEL} from "../shared/helpers/rules";


export const SubmitRetroHuntTaskFetcher = (p) => {
  const {ruleId, data} = p;
  return axios.post(`${apiUrl}/retrohunt/tasks/rule/${ruleId}`, data).then(res => res.data);
}

export const useSubmitRetroHuntTask = (fetcher = SubmitRetroHuntTaskFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['add-retrohunt-tasks'],
    (params) => fetcher(params),
    {
      onSuccess: (_, {ruleId}) => {
        queryClient.invalidateQueries('add-retrohunt-tasks');
        queryClient.invalidateQueries(['retrohunt', 'tasks']);
        queryClient.invalidateQueries(['all-rules', YARA_LABEL, '']);
        queryClient.invalidateQueries(['rule', ruleId, true]);
        queryClient.invalidateQueries(['rule', ruleId, false]);
      }}
  )
}
