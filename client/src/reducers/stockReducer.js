import {
  GET_STOCK,
  STOCK_LOADING,
  CLEAR_CURRENT_STOCK,
  GET_STOCK_BY_ID,
  GET_NEW_STOCK_HISTORY_DATES,
  GET_NEW_STOCK_HISTORY_DATES_LOADING,
  GET_NEW_STOCKS_HISTORY_BY_DATE,
  GET_EXISTING_STOCK_HISTORY_DATES,
  GET_EXISTING_STOCK_HISTORY_DATES_LOADING,
  GET_EXISTING_STOCKS_HISTORY_BY_DATE,
  GET_DELETED_STOCK_HISTORY_DATES_LOADING,
  GET_DELETED_STOCKS_HISTORY_BY_DATE
} from "../actions/types";

const initialState = {
  stock: null,
  loading: false,
  stockbyid: null,
  newstockhistory: null,
  newstockhistoryloading: false,
  newstockhistorybydate: null,
  existingstockhistory: null,
  existingstockhistoryloading: false,
  existingstockhistorybydate: null,
  deletedstockhistoryloading: false,
  deletedstockhistorybydate: null
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
    case GET_NEW_STOCK_HISTORY_DATES_LOADING:
      return {
        ...state,
        newstockhistoryloading: true
      };
    case GET_NEW_STOCK_HISTORY_DATES:
      return {
        ...state,
        newstockhistory: action.payload, //if there are so newstockhistory get filled with payload
        newstockhistoryloading: false
      };
    case GET_NEW_STOCKS_HISTORY_BY_DATE:
      return {
        ...state,
        newstockhistorybydate: action.payload, //if there are so newstockhistorybydate get filled with payload
        newstockhistoryloading: false
      };

    case GET_EXISTING_STOCK_HISTORY_DATES_LOADING:
      return {
        ...state,
        existingstockhistoryloading: true
      };
    case GET_EXISTING_STOCK_HISTORY_DATES:
      return {
        ...state,
        existingstockhistory: action.payload, //if there are so existingstockhistory get filled with payload
        existingstockhistoryloading: false
      };
    case GET_EXISTING_STOCKS_HISTORY_BY_DATE:
      return {
        ...state,
        existingstockhistorybydate: action.payload, //if there are so existingstockhistorybydate get filled with payload
        existingstockhistoryloading: false
      };

    case GET_DELETED_STOCK_HISTORY_DATES_LOADING:
      return {
        ...state,
        deletedstockhistoryloading: true
      };
    case GET_DELETED_STOCKS_HISTORY_BY_DATE:
      return {
        ...state,
        deletedstockhistorybydate: action.payload, //if there are so deletedstockhistory get filled with payload
        deletedstockhistoryloading: false
      };

    default:
      return state;
  }
}
