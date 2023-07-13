import axios from "axios";
import {apiUrl} from "../../config/api";
import {useQuery} from "react-query";


const RetroHuntFetcher = (endpoint) => {
  return axios.get(`${apiUrl}/retrohunt/${endpoint}`)
    .then(res => res.data);
}

const useRetroHuntQuery = (endpoint = null, options = {}, fetcher = RetroHuntFetcher) => {
  return useQuery(['retrohunt', endpoint],() => fetcher(endpoint), options)
}

export const useRetroHuntTasks = (uid = null) => {
  const endpoint = `tasks${(uid) ? `/${uid}` : ''}`;
  return useRetroHuntQuery(endpoint, {refetchInterval: 5000});
}

export const useRetroHuntTaskMatches = (uid, limit = 0, offset = 0) => {
  const urlParams = new URLSearchParams();
  if (limit) {
    urlParams.set('limit', limit);
  }
  if (offset) {
    urlParams.set('offset', offset * limit);
  }
  const endpoint = `tasks/${uid}/matches?${urlParams.toString()}`;

  return useRetroHuntQuery(endpoint);
}
