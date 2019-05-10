import axios from "axios";

import {
  GET_WAREHOUSE,
  WAREHOUSE_LOADING,
  GET_WAREHOUSE_BY_ID,
  GET_ERRORS
} from "./types";

import { sendFlashMessage } from "./flashMessage";

// Get current all warehouse
export const getCurrentWarehouses = () => dispatch => {
  dispatch(setwarehouseLoading()); //here we dispatch function called setwarehouseLoading() which will set the loading state True before it actually does the request
  axios
    .get("/api/warehouse/all")
    .then(res =>
      dispatch({
        type: GET_WAREHOUSE,
        payload: res.data //so here is the actual warehouse
      })
    )
    .catch(err =>
      dispatch({
        type: GET_WAREHOUSE,
        payload: {}
      })
    );
};

// warehouse loading
export const setwarehouseLoading = () => {
  return {
    type: WAREHOUSE_LOADING //here we dont send payload only lets the reducer know warehouse is loading
  };
};

// Create warehouse
export const addWarehouse = (warehouseData, history) => dispatch => {
  axios
    .post("/api/warehouse/addnewwarehouse", warehouseData)
    //.then(response => console.log("response from api " + response.data._id))
    //.then(response => history.push("/show-warehouse/" + response.data._id))
    .then(() => {
      dispatch(
        sendFlashMessage("Warehouse is Added Successfully !!", "alert-success")
      );
    })
    .then(res => history.push("/warehouse-setting"))
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

// Get current warehouse by id
export const singlewarehousebyid = id => dispatch => {
  axios
    .get(`/api/warehouse/singlewarehousebyid/${id}`)
    .then(res =>
      dispatch({
        type: GET_WAREHOUSE_BY_ID, //get article info by its id from warehouse
        payload: res.data //so here is the actual warehouse
      })
    )
    .catch(err => {
      console.log(err);
    });
};

// Edit Warehouse
export const editWarehouse = (warehouseData, paramid, history) => dispatch => {
  axios
    .put(`/api/warehouse/updatesinglewarehouse/` + paramid, warehouseData)
    .then(() => {
      // console.log(message + className);

      dispatch(
        sendFlashMessage(
          "Warehouse is Updated Successfully !!",
          "alert-success"
        )
      );
    })
    //.then(alert("Product Warehouse is Update Successfully !!"))
    .then(res => history.push("/warehouse-setting"))
    .catch(err => {
      //console.log(err.response.data);

      dispatch(
        sendFlashMessage(err.response.data.message, err.response.data.className)
      );
    });
};

// Delete warehouse
export const deleteWarehousebyid = (id, history) => dispatch => {
  if (
    window.confirm(
      "Are you sure ? This Warehosue data will deleted permanently!"
    )
  ) {
    axios
      .delete(`/api/warehouse/singlewarehouseremove/${id}`)
      .then(() => {
        // console.log(message + className);

        dispatch(
          sendFlashMessage(
            "Warehouse is Deleted Successfully !!",
            "alert-success"
          )
        );
      })
      .then(res => history.push("/warehouse-setting"))
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
