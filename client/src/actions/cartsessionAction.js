import axios from "axios";

import {
  GET_SESSION_CART,
  SESSION_CART_LOADING,
  CLEAR_CURRENT_SESSION_CART,
  GET_SESSION_CART_BY_ID,
  PRODUCT_ADDED_IN_SESSION_CART_BY_ID,
  PRODUCT_IN_SESSION_CART_INC_BY_1_ID,
  PRODUCT_IN_SESSION_CART_DEC_BY_1_ID,
  PRODUCT_IN_SESSION_CART_DELETE_BY_ID,
  GET_ERRORS
} from "../actions/types";

import { sendFlashMessage } from "./flashMessage";

// Get current all PRODUCT from session
export const getCurrentSessionProducts = () => dispatch => {
  dispatch(setSessionProductsLoading()); //here we dispatch function called setStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/cart")
    .then(res =>
      dispatch({
        type: GET_SESSION_CART,
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

// Get current session product by id
export const singlecurrentsessionprodbyid = id => dispatch => {
  axios
    .get(`/api/stock/singlecurrentsessionprod/${id}`)
    .then(res =>
      dispatch({
        type: GET_SESSION_CART_BY_ID,
        payload: res.data //so here is the actual stock
      })
    )
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

//will work on below code for adding the addtocart,clearcart functionality using redux

// Create addproduct to session
export const addproducttosession = (
  prodstk_id,
  prodbillingwarehouse,
  orderitemquantity,
  history
) => dispatch => {
  //console.log("action values are :" + id + " and " + orderitemquantity);
  axios
    .get(
      `/api/cart/add/${prodstk_id}&${prodbillingwarehouse}&${orderitemquantity}`
    )
    .then(res =>
      dispatch({
        type: PRODUCT_ADDED_IN_SESSION_CART_BY_ID,
        payload: res.data
      })
    )
    .then(() => {
      // console.log(message + className);

      dispatch(
        sendFlashMessage(
          "Product Stock is Added in Your Cart !!",
          "alert-success"
        )
      );
    })
    .then(dispatch(getCurrentSessionProducts()))
    .then(res => history.push("/create-invoice"))
    .catch(err =>
      // console.log(err.response.data)
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      )
    );
};

// SessionProducts loading
export const setSessionProductsLoading = () => {
  return {
    type: SESSION_CART_LOADING //here we dont send payload only lets the reducer know SESSION_CART_LOADING is loading
  };
};

// Clear stock
export const clearCurrentStock = () => {
  return {
    type: CLEAR_CURRENT_SESSION_CART //here after logout we dispatch to the reducer
  };
};

//  product inc by 1 in session
export const productincby1insession = (id, actionadd, history) => dispatch => {
  //console.log("action values are :" + id + " and " + orderitemquantity);
  axios
    .get(`/api/cart/update/${id}?action=${actionadd}`)
    .then(res =>
      dispatch({
        type: PRODUCT_IN_SESSION_CART_INC_BY_1_ID,
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
};

//  product DEC by 1 in session
export const productdecby1insession = (id, actiondec, history) => dispatch => {
  //console.log("action values are :" + id + " and " + orderitemquantity);
  axios
    .get(`/api/cart/update/${id}?action=${actiondec}`)
    .then(res =>
      dispatch({
        type: PRODUCT_IN_SESSION_CART_DEC_BY_1_ID,
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
};
//  product delete by id in session
export const productdeletebyidinsession = (
  id,
  actiondelete,
  history
) => dispatch => {
  //console.log("action values are :" + id + " and " + orderitemquantity);
  axios
    .get(`/api/cart/update/${id}?action=${actiondelete}`)
    .then(res =>
      dispatch({
        type: PRODUCT_IN_SESSION_CART_DELETE_BY_ID,
        payload: res.data
      })
    )
    .then(dispatch(getCurrentSessionProducts()))
    .then(res => history.push("/cartproducts"))
    .catch(err =>
      dispatch({
        type: GET_ERRORS,
        payload: err.response.data
      })
    );
};

// Clear Cart Session
export const clearSessionCart = history => dispatch => {
  if (
    window.confirm(
      "Are you sure ? Your All Products In Cart Deleted permanently!"
    )
  ) {
    axios
      .get(`/api/cart/clear`)
      .then(res =>
        dispatch({
          type: CLEAR_CURRENT_SESSION_CART,
          payload: res.data
        })
      )
      .then(dispatch(getCurrentSessionProducts()))
      .then(res => history.push("/cartproducts"))
      .catch(err =>
        dispatch({
          type: GET_ERRORS,
          payload: err.response.data
        })
      );
  }
};
