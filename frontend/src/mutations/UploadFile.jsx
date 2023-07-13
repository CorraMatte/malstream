import {apiUrl} from "../config/api"
import axios from "axios";
import {useMutation, useQueryClient} from "react-query";
import {ALL_RESULTS_SECTION, PENDING_RESULTS_SECTION} from "../containers/Indicator/components/IndicatorResults";


export const UploadFileFetcher = (params) => {
  return axios.post(`${apiUrl}/upload`, params, {'Content-Type': 'multipart/form-data'}).then(res => res.data);
}

export const useUploadFileMutation = (fetcher = UploadFileFetcher) => {
  const queryClient = useQueryClient();
  return useMutation(
    ['upload-file'],
    (params) => fetcher(params),
    {onSuccess: () => {
      queryClient.invalidateQueries('upload-file');
      queryClient.invalidateQueries(['indicator', 0, 20, ALL_RESULTS_SECTION]);
      queryClient.invalidateQueries(['indicator-count', ALL_RESULTS_SECTION]);
        queryClient.invalidateQueries(['indicator', 0, 20, PENDING_RESULTS_SECTION]);
        queryClient.invalidateQueries(['indicator-count', PENDING_RESULTS_SECTION]);
    }}
  )
}
