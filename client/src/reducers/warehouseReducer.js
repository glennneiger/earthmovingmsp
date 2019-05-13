import {
  GET_WAREHOUSE,
  GET_WAREHOUSE_BY_ID,
  GET_SINGLE_PRODUCT_ALL_ITEM_WITH_TOTALQTY_WAREHOUSE_BY_ID,
  GET_ERRORS
} from "../actions/types";

const initialState = {
  warehouse: null,
  loading: false,
  warehousebyid: null,
  allpairwithtotalqtyinfo: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case GET_WAREHOUSE:
      return {
        ...state,
        warehouse: action.payload, //if there are so stocks get filled with payload
        loading: false
      };

    case GET_WAREHOUSE_BY_ID:
      return {
        ...state,
        warehousebyid: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    case GET_SINGLE_PRODUCT_ALL_ITEM_WITH_TOTALQTY_WAREHOUSE_BY_ID:
      return {
        ...state,
        allpairwithtotalqtyinfo: action.payload //if there are so allpairwithtotalctninfo get filled with payload
      };

    default:
      return state;
  }
}
