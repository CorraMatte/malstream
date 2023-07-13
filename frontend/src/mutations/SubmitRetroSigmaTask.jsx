import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const SubmitRetroHuntTaskFetcher = (data) => {
  return axios.post(`${apiUrl}/retrosigma/tasks`, data).then(res => res.data);
}

export const useSubmitRetroSigmaTask = (fetcher = SubmitRetroHuntTaskFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['add-retrosigma-tasks'],
    (params) => fetcher(params),
    {
      onSuccess: (_, {ruleId}) => {
        queryClient.invalidateQueries('add-retrosigma-tasks');
      }}
  )
}
