// email testing
export const isvalidEmail = (value) => {
  const regx =
    /^([a-zA-Z0-9_\.\-])+\@(([a-zA-Z0-9\-])+\.)+([a-zA-Z0-9]{2,4})+$/;
  return regx.test(value);
};
// mobile No validation
export const isvalidMobileNo = (value) => {
  if (value.length == 10) {
    const pattern = new RegExp(/^\d{1,10}$/);
    return pattern.test(value);
  }
  return false;
};
// cnic validation
export const isvalidCNIC = (value) => {
  const cnicPattern = /\d\d\d\d\d-\d\d\d\d\d\d\d-\d/;
  return cnicPattern.test(value);
};

// Error Handler
export function updateError(error, setError) {
  setError(error);
  setTimeout(() => {
    setError("");
  }, 2500);
}

export function updateNotification(text, setMessage, type = "error") {
  setMessage({ text, type });
  setTimeout(() => {
    setMessage({ text: "", type: "" });
  }, 5000);
}

export const isValidFieldObject = (obj) => {
  // console.log(obj);
  return Object.values(obj).every((value) => value.trim());
};
