// email testing
export const isvalidEmail = (value) => {
  const regx =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regx.test(value);
};
// mobile No validation
export const isvalidMobileNo = (value) => {
  if(value.length == 10) {
    const pattern = new RegExp(/^\d{1,10}$/);
    return pattern.test(value);
  }
  return false
};
// cnic validation
export const isvalidCNIC = (value) => {
  const cnicPattern = /\d\d\d\d\d-\d\d\d\d\d\d\d-\d/;
  return cnicPattern.test(value);
};

// Error Handler
export const updateError = (error, stateUpdator) => {
  stateUpdator(error);
  setTimeout(() => {
    stateUpdator("");
  }, 2500);
};

export const isValidFieldObject = (obj) => {
  return Object.values(obj).every((value) => value.trim());
};
