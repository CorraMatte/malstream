import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const DeleteResultFetcher = (sha256) => {
  return axios.delete(`${apiUrl}/indicators/${sha256}`).then(res => res.data);
}

export const useDeleteResult = (fetcher = DeleteResultFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['delete-result'],
    (sha256) => fetcher(sha256),
    {
      onSuccess: (_, sha256) => {
        queryClient.invalidateQueries('delete-result');
        queryClient.invalidateQueries(['indicator', sha256]);
        queryClient.invalidateQueries(['indicator', 0, 20]);
      }
    }
  )
}
