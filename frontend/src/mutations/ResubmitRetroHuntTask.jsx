import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {YARA_LABEL} from "../shared/helpers/rules";


export const ResubmitRetroHuntTaskFetcher = (p) => {
  const {ruleId} = p;
  return axios.put(`${apiUrl}/retrohunt/tasks/rule/${ruleId}`, {}).then(res => res.data);
}

export const useResubmitRetroHuntTask = (fetcher = ResubmitRetroHuntTaskFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['update-retrohunt-tasks'],
    (params) => fetcher(params),
    {
      onSuccess: (_, {ruleId}) => {
        queryClient.invalidateQueries('update-retrohunt-tasks');
        queryClient.invalidateQueries(['retrohunt', 'tasks']);
        queryClient.invalidateQueries(['rule', ruleId, true]);
        queryClient.invalidateQueries(['rule', ruleId, false]);
        queryClient.invalidateQueries(['all-rules', YARA_LABEL, '']);
      }}
  )
}
