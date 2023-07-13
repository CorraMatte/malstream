import CardDataHookWithIcon from "./CardDataHookWithIcon";
import {HOURLY_INTERVAL, useStatsAvgResultsByInterval} from "../../../../queries/Stats";


const HourAvgResultCard = () =>
  <CardDataHookWithIcon
    title={'Avg Hourly Results'}
    dataAccessor={(data) => data?.avg?.toFixed(1)}
    useDataHook={useStatsAvgResultsByInterval}
    dataHookParam={HOURLY_INTERVAL}
  />


export default HourAvgResultCard;
