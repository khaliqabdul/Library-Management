import React, { useEffect, useState } from "react";
import "./Form.css";
import { useLocation, useNavigate } from "react-router-dom";
import queryString from "query-string";
import axios from "axios";
import { updateNotification } from "../components/utils/notification";
import AppNotification from "./utils/AppNotification";
import ReactLoading from "react-loading";

const baseURL = "http://localhost:3001";

function Form() {
  const location = useLocation();
  const navigate = useNavigate();
  const [invalidUser, setInvalidUser] = useState("");
  const [success, setSuccess] = useState(false);
  const [busy, setBusy] = useState(true);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({
    text: "",
    type: "",
  });
  const [newPassword, setNewPassword] = useState({
    password: "",
    confirmPassword: "",
  });

  const handleOnChange = ({ target }) => {
    const { name, value } = target;
    setNewPassword({ ...newPassword, [name]: value });
  };

  const { token, id } = queryString.parse(location.search);
  // verify token
  const verifyToken = async () => {
    try {
      await axios(`${baseURL}/verify-resetPassToken?token=${token}&id=${id}`);
      setBusy(false);
    } catch (error) {
      if (error?.response?.data) {
        const { data } = error.response;
        if (!data.success) return setInvalidUser(data.error);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };

  useEffect(() => {
    verifyToken();
  });

  // submit new password
  const handleSubmit = async (e) => {
    e.preventDefault();
    const { password, confirmPassword } = newPassword;
    if (password.trim().length < 8 || password.trim().length > 20)
      return updateNotification(
        "Password must be 8  to 20 characters long",
        setMessage
      );
    if (password !== confirmPassword)
      return updateNotification("Passward does not match!", setMessage);

    try {
      setBusy(true);
      setIsLoading(true);
      const { data } = await axios.post(
        `${baseURL}/reset-password?token=${token}&id=${id}`,
        {
          password,
        }
      );
      setBusy(false);
      setIsLoading(false);
      if (data.success) {
        // navigate(`/reset-password`, { replace: true });
        setSuccess(true);
      }
    } catch (error) {
      setBusy(false);
      if (error?.response?.data) {
        const { data } = error.response;
        setIsLoading(false);
        if (!data.success) return updateNotification(data.error, setMessage);
        return console.log(error.response.data);
      }
      console.log(error);
    }
  };
  if (success)
    return (
      <AppNotification type={"error"} text={"Password Reset Successfully"} />
    );

  if (invalidUser) return <AppNotification type={"error"} text={invalidUser} />;
  if (busy) return <AppNotification type={"error"} text={invalidUser} />;
  return (
    <>
      <div className="Container">
        <h1 className="h1">Reset Password</h1>
        <form onSubmit={handleSubmit} className="form">
          {message.text ? (
            <AppNotification type={message.type} text={message.text} />
          ) : null}
          <div className="inputContainer">
            <input
              type="password"
              placeholder="**********"
              name="password"
              onChange={handleOnChange}
              className="input"
            />
            <input
              type="password"
              placeholder="**********"
              name="confirmPassword"
              onChange={handleOnChange}
              className="input"
            />
            {isLoading ? (
              <ReactLoading
                type="spokes"
                color="#0000FF"
                height={100}
                width={50}
              />
            ) : null}
            <input type="submit" value="Reset Password" className="btn" />
          </div>
        </form>
      </div>
      ;
    </>
  );
}

export default Form;
