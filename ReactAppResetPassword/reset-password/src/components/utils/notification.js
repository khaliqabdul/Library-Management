export function updateNotification(text, setMessage, type = "error") {
  setMessage({ text, type });
  setTimeout(() => {
    setMessage({ text: "", type: "" });
  }, 5000);
}
