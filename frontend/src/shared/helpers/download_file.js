import axios from "axios";
import toast from "react-hot-toast";


const fileDownload = require('js-file-download');


export const download_file = (url, file_name) => {
  const promiseDownloadFile = axios.get(url, {responseType: 'blob'});

  toast.promise(promiseDownloadFile, {
      loading: 'Download started',
      success: res => {
        fileDownload(res.data, file_name);
        return 'Download completed successfully';
      },
      error: (error) => `Error: ${error?.message ? error.message : 'unknown'}`
    },
  );
}