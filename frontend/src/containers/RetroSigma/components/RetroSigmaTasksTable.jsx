import React from "react";
import {apiUrl} from "../../../config/api";
import PropTypes from "prop-types";
import CopyIconToClipboard from "../../../shared/components/icons/CopyIconToClipboard";
import DownloadFileIcon from "../../../shared/components/icons/DownloadFileIcon";
import TableWithData from "../../../shared/components/table/TableWithData";


const RetroSigmaTasksTable = ({hashes}) => {
  const tableColumns = [
    {
      Header: 'SHA256', accessor: 'sha256', Cell: ({value, row}) => <p>
        <CopyIconToClipboard value={value}/>
          <DownloadFileIcon
            url={`${apiUrl}/indicators/${value}/download`}
            filename={value}
          />
        <span className={'ml-3'}>{value}</span>
      </p>
    }
  ];

  const tableConfig = {
    withPagination: true,
  }

  if (hashes.length === 0) {
    return <h5>No files match this SIGMA rule</h5>
  }

  return (
    <TableWithData
      data={hashes}
      tableConfig={tableConfig}
      tableColumns={tableColumns}
    />
  )
}


RetroSigmaTasksTable.propTypes = {
  hashes: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default RetroSigmaTasksTable;
