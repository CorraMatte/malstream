import DownloadOutlineIcon from "mdi-react/DownloadOutlineIcon";
import {download_file} from "../../helpers/download_file";
import PropTypes from "prop-types";


const DownloadFileIcon = ({url, filename, size = 24, style = {}}) => {
  return <DownloadOutlineIcon
    onClick={() => download_file(url, filename)}
    size={size}
    style={Object.assign({}, {fill: 'white', padding: '2px'}, style)}
    className={'border-hover-white'}
  />
}

DownloadFileIcon.propTypes = {
  url: PropTypes.string.isRequired,
  filename: PropTypes.string.isRequired,
  size: PropTypes.number,
  style: PropTypes.object,
}

export default DownloadFileIcon;
