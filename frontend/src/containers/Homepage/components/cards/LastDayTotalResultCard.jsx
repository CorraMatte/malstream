import CardDataHookWithIcon from "./CardDataHookWithIcon";
import {DAILY_INTERVAL, useStatsTotalResultsByInterval} from "../../../../queries/Stats";


const LastDayTotalResultCard = () =>
  <CardDataHookWithIcon
    title={'Last Day Results'}
    dataAccessor={(data) => data?.total}
    useDataHook={useStatsTotalResultsByInterval}
    dataHookParam={DAILY_INTERVAL}
  />


export default LastDayTotalResultCard;
