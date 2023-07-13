import {useRetroHuntTaskMatches} from "../../../queries/RetroHunt";
import TableWithDataHookPagination from "../table/TableWithDataHookPagination";
import React from "react";
import CopyIconToClipboard from "../icons/CopyIconToClipboard";
import _ from "lodash";
import {apiUrl} from "../../../config/api";
import PropTypes from "prop-types";
import DownloadFileIcon from "../icons/DownloadFileIcon";


const RetroHuntTasksPaginatedTable = ({task_id, task_files_matched}) => {
  const tableColumns = [
    {
      Header: 'SHA256', accessor: 'sha256', Cell: ({value, row}) => <p>
        <CopyIconToClipboard value={value}/>
        {
          row.original.path && !_.isUndefined(row.original.ordinal) &&
          <DownloadFileIcon
            url={`${apiUrl}/retrohunt/download?uid=${task_id}&file_path=${row.original.path}&ordinal=${row.original.ordinal}`}
            filename={value}
          />
        }
        <span className={'ml-3'}>{value}</span>
      </p>
    }
  ];

  const tableConfig = {
    withPagination: true,
  }

  if (task_files_matched === 0) {
    return <h5>No files match this YARA rule</h5>
  }

  return (
    <TableWithDataHookPagination
      useDataQuery={useRetroHuntTaskMatches}
      tableColumns={tableColumns}
      queryParams={task_id}
      tableConfig={tableConfig}
      totalItems={task_files_matched}
    />
  )
}


RetroHuntTasksPaginatedTable.propTypes = {
  task_id: PropTypes.string.isRequired,
  task_files_matched: PropTypes.number.isRequired,
}

export default RetroHuntTasksPaginatedTable;
