export const getTooltipStyles = () => (
  {
    contentStyle: {
      backgroundColor: '#2e2c34'
    },
    itemStyle: null
  }
)


export const copyTargetContent = (target) => {
  const dummy = document.createElement("textarea");
  document.body.appendChild(dummy);
  dummy.value = target;
  dummy.select();
  document.execCommand("copy");
  document.body.removeChild(dummy);
}


export const getErrorMessageFromResponse = (response) => {
  let errorMessage = response.error.response?.data?.message;

  if (!errorMessage) {
    errorMessage = `${response.status} - unknown error. Please contact the administrator`
  }

  return `Error: ${errorMessage}`;
}

export const isValidSha256 = (sha256) => {
  const reg = new RegExp(/^[a-f0-9]{64}$/);
  return reg.test(sha256);
}


export const upperCaseFirstLetter = (string) => string.charAt(0).toUpperCase() + string.slice(1);

export default getTooltipStyles;