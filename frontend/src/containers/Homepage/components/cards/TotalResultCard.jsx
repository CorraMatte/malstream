import CardDataHookWithIcon from "./CardDataHookWithIcon";
import {useStatsTotalResults} from "../../../../queries/Stats";
import DatabaseIcon from "mdi-react/DatabaseIcon";


const TotalResultCard = () =>
  <CardDataHookWithIcon
    title={'Total Results'}
    dataAccessor={(data) => data?.count}
    useDataHook={useStatsTotalResults}
    icon={<DatabaseIcon />}
  />


export default TotalResultCard;
