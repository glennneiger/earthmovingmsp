import axios from "axios";

import {
  GET_SESSION_WAREHOUSE_TRANSFER,
  GET_ALL_WAREHOUSE_TRANSFER_HISTORY,
  SESSION_WAREHOUSE_TRANSFER_LOADING,
  WAREHOUSE_TRANSFER_HISTORY_LOADING,
  GET_WAREHOUSE_TRANSFER_HISTORY_BY_DATE,
  GET_WAREHOUSE_TRANSFER_HISTORY_BY_ID,
  CLEAR_CURRENT_WAREHOUSE_TRANSFER,
  PRODUCT_ADDED_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID,
  PRODUCT_DELETE_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID,
  GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING,
  GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING_STOP,
  GET_ERRORS
} from "../actions/types";

import { sendFlashMessage } from "./flashMessage";

// Get current all PRODUCT from session
export const getCurrentSessionWarehoustrans = () => dispatch => {
  dispatch(setSessionWarehoustransLoading()); //here we dispatch function called setStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/warehousetransfer")
    .then(res =>
      dispatch({
        type: GET_SESSION_WAREHOUSE_TRANSFER,
        payload: res.data //so here is the actual PRODUCT from session
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create addproduct to session
export const addtransprodtosession = (
  productsizeconfigs_id,
  prodwarehouseorigin,
  prodwarehousetransfer,
  ctntrans,
  history
) => dispatch => {
  //console.log("action values are :" + id + " and " + prodwarehouseorigin);
  axios
    .get(
      `/api/warehousetransfer/add/${productsizeconfigs_id}&${prodwarehouseorigin}&${prodwarehousetransfer}&${ctntrans}`
    )
    .then(res =>
      dispatch({
        type: PRODUCT_ADDED_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID,
        payload: res.data
      })
    )
    .then(() => {
      // console.log(message + className);

      dispatch(
        sendFlashMessage(
          "Product Stock is Added in Your Warehouse Transfer List !!",
          "alert-success"
        )
      );
    })
    .then(res => history.push("/stock-transfer"))

    .catch(err => {
      // console.log(err.response.data.message);
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// SessionProducts loading
export const setSessionWarehoustransLoading = () => {
  return {
    type: SESSION_WAREHOUSE_TRANSFER_LOADING //here we dont send payload only lets the reducer know SESSION_WAREHOUSE_TRANSFER_LOADING is loading
  };
};

//  product delete by id in session
export const warehoustransdeletebyidinsession = (
  prosizeconfig_id,
  prodwarehouseorigin,
  prodwarehousetransfer,
  ctntrans,
  actiondelete,
  history
) => dispatch => {
  //console.log("action values are :" + id + " and " + orderctnquantity);
  axios
    .get(
      `/api/warehousetransfer/update/${prosizeconfig_id}&${prodwarehouseorigin}&${prodwarehousetransfer}&${ctntrans}?action=${actiondelete}`
    )
    .then(res =>
      dispatch({
        type: PRODUCT_DELETE_IN_SESSION_WAREHOUSE_TRANSFER_BY_ID,
        payload: res.data
      })
    )
    .then(res => history.push("/stock-transfer"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Create createWareHouseTransfer
export const createWareHouseTransfer = (
  productsizeconfigs_id,
  prodwarehouseorigin,
  prodwarehousetransfer,
  ctntrans,
  history
) => dispatch => {
  dispatch(setcreateWareHouseTransferLoading()); //here we dispatch function called setcreateWareHouseTransferLoading() which will set the loading state True before it actually does the request
  axios
    .get(
      `/api/warehousetransfer/addnewwarehousetransfer/${productsizeconfigs_id}&${prodwarehouseorigin}&${prodwarehousetransfer}&${ctntrans}`
    )
    .then(response =>
      history.push("/show-warehouse-transfer/" + response.data._id)
    )
    .then(() => {
      // console.log(message + className);
      dispatch(setcreateWareHouseTransferLoadingStop()); //here we dispatch function called setcreateWareHouseTransferLoadingStop() which will set the loading state False after it actually does the request

      dispatch(
        sendFlashMessage("Warehouse Transfer Successfully !!", "alert-success")
      );
    })

    // .then(res => history.push("/stock-transfer"))
    .catch(err => {
      // console.log(err.response.data.message);
      dispatch(setcreateWareHouseTransferLoadingStop()); //here we dispatch function called setcreateWareHouseTransferLoadingStop() which will set the loading state False after it actually does the request

      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// createWareHouseTransfer loading
export const setcreateWareHouseTransferLoading = () => {
  return {
    type: GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING //here we dont send payload only lets the reducer know GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING is loading
  };
};
// createWareHouseTransfer loading STOP
export const setcreateWareHouseTransferLoadingStop = () => {
  return {
    type: GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING_STOP //here we dont send payload only lets the reducer know GET_WAREHOUSE_TRANSFER_PROD_STOCKS_LOADING_STOP is loading
  };
};

// Clear Cart Session
export const clearSessionWarehouseTrans = history => dispatch => {
  if (
    window.confirm(
      "Are you sure ? Your All Products In Cart Deleted permanently!"
    )
  ) {
    axios
      .get(`/api/cart/clear`)
      .then(res =>
        dispatch({
          type: CLEAR_CURRENT_WAREHOUSE_TRANSFER,
          payload: res.data
        })
      )
      .then(res => history.push("/cartproducts"))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};

// getAllWarehoustransHistory
export const getAllWarehoustransHistoryProdStockDates = () => dispatch => {
  dispatch(setWarehoustranshistoryprodstockdatesLoading()); //here we dispatch function called setStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/warehousetransfer/warehousetransferhistoryall")
    .then(res =>
      dispatch({
        type: GET_ALL_WAREHOUSE_TRANSFER_HISTORY,
        payload: res.data //so here is the actual PRODUCT from WAREHOUSE TRANSFER HISTORY
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ALL_WAREHOUSE_TRANSFER_HISTORY,
        payload: {}
      })
    );
};

// SessionProducts loading
export const setWarehoustranshistoryprodstockdatesLoading = () => {
  return {
    type: WAREHOUSE_TRANSFER_HISTORY_LOADING //here we dont send payload only lets the reducer know WAREHOUSE_TRANSFER_HISTORY_LOADING is loading
  };
};

// Get current getWarehoustransHistorybyDate
export const getWarehoustransHistorybyDate = date => dispatch => {
  axios
    .get(`/api/warehousetransfer/warehousetransferhistorybydate/${date}`)
    .then(res =>
      dispatch({
        type: GET_WAREHOUSE_TRANSFER_HISTORY_BY_DATE,
        payload: res.data //so here is the actual stock
      })
    )
    .catch(err => {
      console.log(err);

      {
        /* dispatch(
        sendFlashMessage(
          err.response.data.errors.message,
          err.response.data.errors.className
        )
      );
        */
      }
    });
};

// Get current warehouse transfer history by id
export const singlewarehousetranshis = id => dispatch => {
  axios
    .get(`/api/warehousetransfer/singlewarehousetranshistory/${id}`)
    .then(res =>
      dispatch({
        type: GET_WAREHOUSE_TRANSFER_HISTORY_BY_ID,
        payload: res.data //so here is the actual warehousetransfer history
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};
