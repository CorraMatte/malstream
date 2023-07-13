export const addFetchOpts = (options = {}, timeout = 20000) => {
  options.headers = options?.headers || {};
  options.timeout = timeout;
  return options;
}

export const addAxiosOpts = addFetchOpts;
