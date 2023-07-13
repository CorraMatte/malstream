import {Table} from "reactstrap";
import React from "react";
import PropTypes from "prop-types";


export const TableDetails = ({item, ...props}) => (
  <Table>
    <tbody>{
      Object.entries(item).map(([key, value]) =>
        value && !Array.isArray(value) && <tr><td className={'text-break w-50'}><p>{key}</p></td><th className={'text-break w-50'}><p>{value}</p></th></tr>
      )
    }</tbody>
  </Table>
)


TableDetails.propTypes = {
  item: PropTypes.shape().isRequired,
};

export default TableDetails;
