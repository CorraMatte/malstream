import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";


export const DeleteRetroHuntTaskFetcher = (uid) => {
  return axios.delete(`${apiUrl}/retrohunt/tasks/${uid}`).then(res => res.data );
}

export const useDeleteRetroHuntTask = (fetcher = DeleteRetroHuntTaskFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['delete-retrohunt-tasks'],
    (uid) => fetcher(uid),
    {onSuccess: () => {
        queryClient.invalidateQueries('delete-retrohunt-tasks');
        queryClient.invalidateQueries(['retrohunt', 'tasks'])
      }}
  )
}
