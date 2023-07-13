import axios from "axios";
import {apiUrl} from "../../config/api";
import {useQuery} from "react-query";


export const HOURLY_INTERVAL = 'by_hour'
export const DAILY_INTERVAL = 'by_day'

const StatsFetcher = (endpoint) => {
  return axios.get(`${apiUrl}/stats/${endpoint}`).then(res => res.data);
}

const useStatsQuery = (
  endpoint = null, options = {refetchInterval: 10000}, fetcher = StatsFetcher
) => {
  return useQuery(['stats', endpoint],() => fetcher(endpoint), options)
}

export const useStatsTopResults = (rule_type, limit = 10) => {
  const urlParams = new URLSearchParams();
  urlParams.set('limit', limit);

  return useStatsQuery(`top/${rule_type}?${urlParams.toString()}`);
}

export const useStatsTotal = (section) => {
  return useStatsQuery(`total/${section}`);
}


export const useStatsTotalResults = (status) => {
  const urlParams = new URLSearchParams();
  if (status) {
    urlParams.set('status', status);
  }

  return useStatsQuery(`total/results?${urlParams.toString()}`);
}


export const useStatsResultTrend = (days = 30) => {
  const urlParams = new URLSearchParams();
  if (days) {
    urlParams.set('days', days);
  }

  return useStatsQuery(`trend/results/by_hour?${urlParams.toString()}`);
}


export const useStatsTrendOsint = (days = 7) => {
  const urlParams = new URLSearchParams();
  if (days) {
    urlParams.set('days', days);
  }

  return useStatsQuery(`trend/osint/by_hour?${urlParams.toString()}`);
}


export const useStatsAvgResultsByInterval = (interval) => {
  return useStatsQuery(`avg/results/${interval}`)
}


export const useStatsTotalResultsByInterval = (interval) => {
  return useStatsQuery(`total/interval/results/${interval}`)
}
