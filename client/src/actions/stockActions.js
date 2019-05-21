import axios from "axios";

import {
  GET_STOCK,
  STOCK_LOADING,
  CLEAR_CURRENT_STOCK,
  GET_STOCK_BY_ID,
  STOCK_EDITED_BY_ID,
  ADD_ON_EXISTING_PRODUCT_STOCK,
  REMOVE_ON_EXISTING_PRODUCT_STOCK,
  GET_NEW_STOCK_HISTORY_DATES,
  GET_NEW_STOCK_HISTORY_DATES_LOADING,
  GET_NEW_STOCKS_HISTORY_BY_DATE,
  GET_EXISTING_STOCK_HISTORY_DATES,
  GET_EXISTING_STOCK_HISTORY_DATES_LOADING,
  GET_EXISTING_STOCKS_HISTORY_BY_DATE,
  GET_DELETED_STOCK_HISTORY_DATES_LOADING,
  GET_DELETED_STOCKS_HISTORY_BY_DATE,
  GET_ERRORS
} from "./types";

import { sendFlashMessage } from "./flashMessage";

// Get current all stock
export const getCurrentStock = () => dispatch => {
  dispatch(setStockLoading()); //here we dispatch function called setStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/stock/all")
    .then(res =>
      dispatch({
        type: GET_STOCK,
        payload: res.data //so here is the actual stock
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STOCK,
        payload: {}
      })
    );
};

// Get current all stock for view-stock
export const getCurrentAllStock = () => dispatch => {
  dispatch(setAllStockLoading()); //here we dispatch function called setAllStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/stock/viewallstock")
    .then(res =>
      dispatch({
        type: GET_STOCK,
        payload: res.data //so here is the actual stock
      })
    )
    .catch(err =>
      dispatch({
        type: GET_STOCK,
        payload: {}
      })
    );
};

// Stock loading
export const setAllStockLoading = () => {
  return {
    type: STOCK_LOADING //here we dont send payload only lets the reducer know stock is loading
  };
};

// Get current stock by id
export const singleprodstockbyid = id => dispatch => {
  axios
    .get(`/api/stock/singleprodstock/${id}`)
    .then(res =>
      dispatch({
        type: GET_STOCK_BY_ID,
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

// Create Stock
export const createStock = (stockData, history) => dispatch => {
  axios
    .post("/api/stock/addnewstock", stockData)
    //.then(response => console.log("response from api " + response.data._id))
    //.then(response => history.push("/show-stock/" + response.data._id))
    .then(res => history.push("/view-stock"))
    .then(() => {
      dispatch(
        sendFlashMessage(
          "Product Stock is Added Successfully !!",
          "alert-success"
        )
      );
    })
    //.then(res => history.push("/dashboard"))
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

// Stock loading
export const setStockLoading = () => {
  return {
    type: STOCK_LOADING //here we dont send payload only lets the reducer know stock is loading
  };
};

// Clear stock
export const clearCurrentStock = () => {
  return {
    type: CLEAR_CURRENT_STOCK //here after logout we dispatch to the reducer
  };
};

// Edit Stock
export const editStock = (stockData, paramid, history) => dispatch => {
  axios
    .put(`/api/stock/updatesingleprodstock/` + paramid, stockData)
    .then(() => {
      // console.log(message + className);

      dispatch(
        sendFlashMessage(
          "Product Stock is Updated Successfully !!",
          "alert-success"
        )
      );
    })
    //.then(alert("Product Stock is Update Successfully !!"))
    .then(res => history.push("/view-stock"))
    .catch(err => {
      //console.log(err.response.data);

      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// Delete Stock
export const deleteStock = (id, history) => dispatch => {
  if (
    window.confirm(
      "Are you sure ? This product stock will deleted permanently!"
    )
  ) {
    axios
      .delete(`/api/stock/singleprodremove/${id}`)
      .then(() => {
        // console.log(message + className);

        dispatch(
          sendFlashMessage(
            "Product Stock is Deleted Successfully !!",
            "alert-success"
          )
        );
      })
      .then(res => history.push("/"))
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

// add on existing product stock
export const addonexistprodstock = (AddStockData, history) => dispatch => {
  //console.log("action values are :" + prodstk_id + " and " + prodwarehouse);
  axios
    .post("/api/stock/addonexistingprodstock", AddStockData)
    .then(res =>
      dispatch({
        type: ADD_ON_EXISTING_PRODUCT_STOCK
      })
    )
    .then(() => {
      // console.log(message + className);

      dispatch(sendFlashMessage("Product Stock is Added!!", "alert-success"));
    })
    .then(res => history.push("/view-stock"))

    .catch(err => {
      // console.log(err.response.data.message);
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// remove on existing product stock
export const removeonexistprodstock = (
  RemoveStockData,
  history
) => dispatch => {
  //console.log("action values are :" + prodstk_id + " and " + prodwarehouse);
  axios
    .post("/api/stock/removeonexistingprodstock", RemoveStockData)
    .then(res =>
      dispatch({
        type: REMOVE_ON_EXISTING_PRODUCT_STOCK
      })
    )
    .then(() => {
      // console.log(message + className);

      dispatch(
        sendFlashMessage(
          "Product Stock is Remove Successfully!!",
          "alert-success"
        )
      );
    })
    .then(res => history.push("/view-stock"))

    .catch(err => {
      // console.log(err.response.data.message);
      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

////////////////////////////////////////////////

// Get unique product stock dates acc to collection data of newstockhistory
export const getNewStockHistoryProdStockDates = () => dispatch => {
  dispatch(setNewStockHistoryProdStockLoading()); //here we dispatch function called setStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/stock/newstockhistoryall")
    .then(res =>
      dispatch({
        type: GET_NEW_STOCK_HISTORY_DATES,
        payload: res.data //so here is the actual stock
      })
    )
    .catch(err =>
      dispatch({
        type: GET_NEW_STOCK_HISTORY_DATES,
        payload: {}
      })
    );
};

// Stock loading
export const setNewStockHistoryProdStockLoading = () => {
  return {
    type: GET_NEW_STOCK_HISTORY_DATES_LOADING //here we dont send payload only lets the reducer know stock is loading
  };
};

// Get current stock by id
export const getNewStockHistorybyDate = date => dispatch => {
  axios
    .get(`/api/stock/newstockhistorybydate/${date}`)
    .then(res =>
      dispatch({
        type: GET_NEW_STOCKS_HISTORY_BY_DATE,
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

// Get unique product stock dates acc to collection data of newstockhistory
export const getExistingStockHistoryProdStockDates = () => dispatch => {
  dispatch(setExistingStockHistoryProdStockLoading()); //here we dispatch function called setStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/stock/existingstockhistoryall")
    .then(res =>
      dispatch({
        type: GET_EXISTING_STOCK_HISTORY_DATES,
        payload: res.data //so here is the actual stock
      })
    )
    .catch(err =>
      dispatch({
        type: GET_EXISTING_STOCK_HISTORY_DATES,
        payload: {}
      })
    );
};

// Stock loading
export const setExistingStockHistoryProdStockLoading = () => {
  return {
    type: GET_EXISTING_STOCK_HISTORY_DATES_LOADING //here we dont send payload only lets the reducer know stock is loading
  };
};

// Get current stock by id
export const getExistingStockHistorybyDate = date => dispatch => {
  axios
    .get(`/api/stock/existingstockhistorybydate/${date}`)
    .then(res =>
      dispatch({
        type: GET_EXISTING_STOCKS_HISTORY_BY_DATE,
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
///////////////////

// Get unique product stock dates acc to collection data of deletedstockhistories
export const getDeletedStockHistoryProdStockDates = () => dispatch => {
  dispatch(setDeletedStockHistoryProdStockLoading()); //here we dispatch function called setDeletedStockHistoryProdStockLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/stock/deletedstockhistoryall")
    .then(res =>
      dispatch({
        type: GET_DELETED_STOCKS_HISTORY_BY_DATE,
        payload: res.data //so here is the actual deleted stock
      })
    )
    .catch(err =>
      dispatch({
        type: GET_DELETED_STOCKS_HISTORY_BY_DATE,
        payload: {}
      })
    );
};

// Stock loading
export const setDeletedStockHistoryProdStockLoading = () => {
  return {
    type: GET_DELETED_STOCK_HISTORY_DATES_LOADING //here we dont send payload only lets the reducer know stock is loading
  };
};

// Get deleted stock by id
export const getDeletedStockHistoryByDate = date => dispatch => {
  axios
    .get(`/api/stock/deletedstockhistorybydate/${date}`)
    .then(res =>
      dispatch({
        type: GET_DELETED_STOCKS_HISTORY_BY_DATE,
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
