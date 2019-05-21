import axios from "axios";

import {
  GET_COMPANY,
  COMPANY_LOADING,
  GET_COMPANY_BY_ID,
  GET_ERRORS
} from "./types";

import { sendFlashMessage } from "./flashMessage";

// Get current all company
export const getCurrentCompanies = () => dispatch => {
  dispatch(setcompanyLoading()); //here we dispatch function called setcompanyLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/company/all")
    .then(res =>
      dispatch({
        type: GET_COMPANY,
        payload: res.data //so here is the actual company
      })
    )
    .catch(err =>
      dispatch({
        type: GET_COMPANY,
        payload: {}
      })
    );
};

// company loading
export const setcompanyLoading = () => {
  return {
    type: COMPANY_LOADING //here we dont send payload only lets the reducer know warehouse is loading
  };
};

// Create company
export const addCompany = (companyData, history) => dispatch => {
  axios
    .post("/api/company/addnewcompany", companyData)
    //.then(response => console.log("response from api " + response.data._id))
    //.then(response => history.push("/show-company/" + response.data._id))
    .then(() => {
      dispatch(
        sendFlashMessage("Company is Added Successfully !!", "alert-success")
      );
    })
    .then(res => history.push("/company-setting"))
    .catch(err => {
      // console.log(err.response.data);

      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      });

      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// Get current company by id
export const singlecompanybyid = id => dispatch => {
  axios
    .get(`/api/company/singlecompanybyid/${id}`)
    .then(res =>
      dispatch({
        type: GET_COMPANY_BY_ID, //get company info by its id from company
        payload: res.data //so here is the actual company
      })
    )
    .catch(err => {
      console.log(err);
    });
};

// Edit Company
export const editCompany = (companyData, paramid, history) => dispatch => {
  axios
    .put(`/api/company/updatesinglecompany/` + paramid, companyData)
    .then(() => {
      // console.log(message + className);

      dispatch(
        sendFlashMessage("Company is Updated Successfully !!", "alert-success")
      );
    })
    //.then(alert("Product Company is Update Successfully !!"))
    .then(res => history.push("/company-setting"))
    .catch(err => {
      //console.log(err.response.data);

      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// Delete company
export const deleteCompanybyid = (id, history) => dispatch => {
  if (
    window.confirm("Are you sure ? This Company data will deleted permanently!")
  ) {
    axios
      .delete(`/api/company/singlecompanyremove/${id}`)
      .then(() => {
        dispatch(getCurrentCompanies()); //here we first dispatch the getCurrentCompanies()
      })
      .then(() => {
        // console.log(message + className);

        dispatch(
          sendFlashMessage(
            "Company is Deleted Successfully !!",
            "alert-success"
          )
        );
      })
      .then(res => history.push("/company-setting"))
      .catch(err => {
        //console.log(err.response.data);

        dispatch(
          sendFlashMessage(
            err.response.data.message,
            err.response.data.className
          )
        );
      });
  }
};
