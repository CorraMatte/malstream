import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {ALL_RESULTS_SECTION, PENDING_RESULTS_SECTION} from "../containers/Indicator/components/IndicatorResults";


export const DeletePendingResultFetcher = () => {
  return axios.delete(`${apiUrl}/indicators/pending`).then(res => res.data);
}


export const useDeletePendingResult = (fetcher = DeletePendingResultFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['delete-pending-results'],
    (sha256) => fetcher(),
    {
      onSuccess: () => {
        queryClient.invalidateQueries('delete-pending-results');
        queryClient.invalidateQueries(['indicator-count', PENDING_RESULTS_SECTION]);
        queryClient.invalidateQueries(['indicator', 0, 20, PENDING_RESULTS_SECTION]);
        queryClient.invalidateQueries(['indicator-count', ALL_RESULTS_SECTION]);
        queryClient.invalidateQueries(['indicator', 0, 20, ALL_RESULTS_SECTION]);
      }
    }
  )
}
