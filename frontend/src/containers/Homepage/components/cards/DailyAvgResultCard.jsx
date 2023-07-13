import CardDataHookWithIcon from "./CardDataHookWithIcon";
import {DAILY_INTERVAL, useStatsAvgResultsByInterval} from "../../../../queries/Stats";


const HourTotalResultCard = () =>
  <CardDataHookWithIcon
    title={'Avg Daily Results'}
    dataAccessor={(data) => data?.avg?.toFixed(1)}
    useDataHook={useStatsAvgResultsByInterval}
    dataHookParam={DAILY_INTERVAL}
  />


export default HourTotalResultCard;
