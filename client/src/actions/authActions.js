import axios from "axios";
import setAuthToken from "../utils/setAuthToken";
import jwt_decode from "jwt-decode";

import {
  GET_ERRORS,
  SET_CURRENT_USER,
  SET_CURRENT_USER_RESET_PASS_DATA
} from "./types";

import { sendFlashMessage } from "./flashMessage";

// Register User
export const registerUser = (userData, history) => dispatch => {
  axios
    .post("/api/users/register", userData) //here we hit the backend API
    .then(res => history.push("/login")) //if its successfull then redirect to login
    .catch((
      err //here we catch the err object when user perform registration
    ) =>
      dispatch({
        //here we call the dispatch
        //here we dispatch the type with data to the reducer
        type: GET_ERRORS,
        payload: err.response.data //this error object comes from the server when any validation comes fail
      })
    );
};

// Login - Get User Token
export const loginUser = userData => dispatch => {
  axios
    .post("/api/users/login", userData)
    .then(res => {
      // Save to localStorage
      const { token } = res.data;
      // Set token to local storage
      localStorage.setItem("jwtToken", token);
      // Set token to Auth header
      setAuthToken(token); //in token the current user data contain
      // Decode token to get user data
      const decoded = jwt_decode(token); //here we extract the current user data

      // Set current user
      dispatch(setCurrentUser(decoded)); //here we dispatch the seperated function (setCurrentUser=> its declare at bottom of this file )with current user decoded data
    })
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Set logged in user
export const setCurrentUser = decoded => {
  return {
    //here we dispatch the reducer
    type: SET_CURRENT_USER,
    payload: decoded //the decoded contains the actual user data from the token
  };
};

// Log user out
export const logoutUser = () => dispatch => {
  // Remove token from localStorage
  localStorage.removeItem("jwtToken");
  // Remove auth header for future requests
  setAuthToken(false);
  // Set current user to {} which will set isAuthenticated to false
  dispatch(setCurrentUser({}));
};

export const forgotpassUser = userData => dispatch => {
  axios
    .post("/api/users/forgotpassword", userData)
    .then(() => {
      dispatch(
        sendFlashMessage(
          "Check Your Email To Reset New Password !!",
          "alert-success"
        )
      );
    })
    .catch(err =>
      // console.log(err.response.data)
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      )
    );
};

export const resetpassword = token => dispatch => {
  axios
    .get(`/api/users/resetpassword/${token}`)
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER_RESET_PASS_DATA,
        payload: res.data
      })
    )
    .catch(err =>
      // console.log(err.response.data)
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      )
    );
};

export const saveResetPassword = (userresetpassData, history) => dispatch => {
  axios
    .put("/api/users/saveresetpassword/", userresetpassData)
    .then(res => history.push("/login"))
    .then(res =>
      dispatch({
        type: SET_CURRENT_USER_RESET_PASS_DATA,
        payload: {}
      })
    )
    .then(() => {
      alert("Your Password reset successfully !!");
    })
    .catch(err =>
      // console.log(err.response.data)
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      )
    );
};
