import CardDataHookWithIcon from "./CardDataHookWithIcon";
import {HOURLY_INTERVAL, useStatsTotalResultsByInterval} from "../../../../queries/Stats";


const LastHourTotalResultCard = () =>
  <CardDataHookWithIcon
    title={'Last Hour Results'}
    dataAccessor={(data) => data?.total}
    useDataHook={useStatsTotalResultsByInterval}
    dataHookParam={HOURLY_INTERVAL}
  />


export default LastHourTotalResultCard;
