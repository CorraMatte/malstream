import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const ResubmitResultFetcher = (sha256) => {
  return axios.put(`${apiUrl}/indicators/${sha256}`, {}).then(res => res.data);
}

export const useResubmitResult = (fetcher = ResubmitResultFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['update-retrohunt-tasks'],
    (sha256) => fetcher(sha256),
    {
      onSuccess: (_, sha256) => {
        queryClient.invalidateQueries(['indicator', 0, 20]);
        queryClient.invalidateQueries(['indicator-count']);
        queryClient.invalidateQueries(['indicator', sha256]);
      }}
  )
}
