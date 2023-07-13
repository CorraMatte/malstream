import {useLocation} from "react-router-dom";


// A custom hook that builds on useLocation to parse the query string for you.
export const useQueryParams = () => new URLSearchParams(useLocation().search);

export const paramsToObject = (entries) => {
  const result = {}
  for (const [key, value] of entries) {
    if (result[key]) {
      result[key].push(value)
    } else {
      result[key] = [value];
    }
  }

  for (const [key, value] of Object.entries(result)) {
    if (value.length === 1) {
      result[key] = value[0];
    }
  }

  return result;
}
