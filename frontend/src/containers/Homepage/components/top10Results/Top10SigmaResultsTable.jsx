import React from "react";
import TableWithDataHook from "../../../../shared/components/table/TableWithDataHook";
import {useStatsTopResults} from "../../../../queries/Stats";
import {SIGMA_LABEL} from "../../../../shared/helpers/rules";
import {Card, CardBody} from "reactstrap";


const Top10SigmaResultsTable = () => {
  const tableColumns = [
    {Header: 'Signature', accessor: 'name'},
    {Header: 'Count', accessor: 'count',}
  ];

  const tableConfig = {
    striped: true,
    withPagination: false
  }

  return (
    <Card className={'h-auto'}>
      <CardBody>
        <div className="card__title">
          <h4 className={'bold-text d-inline'}>Top 10 Sigma match</h4>
        </div>

        <TableWithDataHook
          useDataQuery={useStatsTopResults}
          queryParam={SIGMA_LABEL}
          tableColumns={tableColumns}
          tableConfig={tableConfig}
        />
      </CardBody>
    </Card>
  )
}


export default Top10SigmaResultsTable;
