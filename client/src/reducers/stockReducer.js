import {
  GET_STOCK,
  STOCK_LOADING,
  CLEAR_CURRENT_STOCK,
  GET_STOCK_BY_ID
} from "../actions/types";

const initialState = {
  stock: null,
  loading: false,
  stockbyid: null
};

export default function(state = initialState, action) {
  switch (action.type) {
    case STOCK_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_STOCK:
      return {
        ...state,
        stock: action.payload, //if there are so stocks get filled with payload
        loading: false
      };
    case CLEAR_CURRENT_STOCK:
      return {
        ...state,
        stock: null //here we set the stock to null
      };
    case GET_STOCK_BY_ID:
      return {
        ...state,
        stockbyid: action.payload, //if there are so stocks get filled with payload
        loading: false
      };

    default:
      return state;
  }
}
